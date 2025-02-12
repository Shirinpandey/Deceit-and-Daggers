require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { connectDB, Player, Score, Game } = require("./database");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Create a new game
app.post("/create-game", async (req, res) => {
  try {
    const { gameKey, hostName } = req.body;
    const newGame = new Game({ gameKey, hostName });
    await newGame.save();
    res.status(201).json(newGame);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Join a game
app.post("/join-game", async (req, res) => {
  try {
    const { gameKey, playerName, role } = req.body;

    const gameExists = await Game.findOne({ gameKey });
    if (!gameExists) return res.status(404).json({ message: "Game not found" });

    const newPlayer = new Player({ gameKey, name: playerName, role });
    await newPlayer.save();

    // Initialize score tracking
    const newScore = new Score({ gameKey, playerName });
    await newScore.save();

    res.status(200).json({ message: "Player joined", player: newPlayer });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get game details
app.get("/game/:gameKey", async (req, res) => {
  try {
    const { gameKey } = req.params;
    const players = await Player.find({ gameKey });
    const scores = await Score.find({ gameKey });
    res.status(200).json({ players, scores });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update score for a player
app.post("/update-score", async (req, res) => {
  try {
    const { gameKey, playerName, points, roundsSurvived, saves } = req.body;

    const playerScore = await Score.findOne({ gameKey, playerName });
    if (!playerScore) return res.status(404).json({ message: "Player not found" });

    playerScore.score += points;
    if (roundsSurvived) playerScore.roundsSurvived += roundsSurvived;
    if (saves) playerScore.saves += saves;

    await playerScore.save();
    res.status(200).json({ message: "Score updated", score: playerScore });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Handle Player Elimination
app.post("/eliminate", async (req, res) => {
  try {
    const { gameKey, playerName } = req.body;

    const player = await Player.findOne({ gameKey, name: playerName });
    if (!player) return res.status(404).json({ message: "Player not found" });

    player.isAlive = false;
    await player.save();

    res.status(200).json({ message: "Player eliminated", player });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// WebSockets for Real-Time Game Updates
io.on("connection", (socket) => {
  console.log("New player connected");

  socket.on("joinRoom", ({ gameKey, playerName }) => {
    socket.join(gameKey);
    io.to(gameKey).emit("playerJoined", { playerName });
  });

  socket.on("eliminatePlayer", ({ gameKey, playerName }) => {
    io.to(gameKey).emit("playerEliminated", { playerName });
  });

  socket.on("disconnect", () => console.log("Player disconnected"));
});

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
