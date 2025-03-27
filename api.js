const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { connectDB, Character, Game } = require("./database");
const generateDeathMessage = require("./deathmessage");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const PORT = process.env.PORT || 8000;

const allowedOrigins = [
  "https://daggers-and-deceit.vercel.app", // ✅ your Vercel frontend
  "http://localhost:8000",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());
connectDB();

io.on("connection", (socket) => {
  console.log(`✅ New WebSocket connection: ${socket.id}`);

  socket.on("joinRoom", (gameKey) => {
    if (!gameKey) {
      console.warn(`⚠️ No gameKey provided for ${socket.id}`);
      return;
    }
    socket.join(gameKey);
    console.log(`✅ Socket ${socket.id} joined room: ${gameKey}`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ WebSocket disconnected: ${socket.id}`);
  });
});

app.post("/create-game", async (req, res) => {
  try {
    const { hostName } = req.body;
    if (!hostName)
      return res.status(400).json({ error: "Host name is required" });

    const gameKey = Math.random().toString(36).substr(2, 6).toUpperCase();
    const newGame = new Game({ gameKey, hostName });
    await newGame.save();

    const hostPlayer = new Character({
      gameKey,
      name: hostName,
      role: "Host",
      isAlive: true,
    });
    await hostPlayer.save();

    console.log(`✅ New game created: ${gameKey} by ${hostName}`);
    return res.json({ gameKey });
  } catch (error) {
    console.error("❌ Error creating game:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/join-game", async (req, res) => {
  try {
    const { gameKey, playerName } = req.body;
    if (!gameKey || !playerName)
      return res.status(400).json({ error: "Missing fields" });

    const game = await Game.findOne({ gameKey });
    if (!game) return res.status(404).json({ error: "Game not found" });

    const newPlayer = new Character({
      gameKey,
      name: playerName,
      role: "Civilian",
      isAlive: true,
    });
    await newPlayer.save();

    const updatedPlayers = await Character.find({ gameKey });
    io.to(gameKey).emit("updatePlayers", { players: updatedPlayers });

    res.json({ message: "Joined successfully" });
  } catch (error) {
    console.error("❌ Error joining game:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/start-game", async (req, res) => {
  try {
    const { gameKey } = req.body;
    if (!gameKey) return res.status(400).json({ error: "Game key required" });

    await Game.findOneAndUpdate({ gameKey }, { $set: { gameStarted: true } });
    io.to(gameKey).emit("gameStarted");

    console.log(`🎮 Game started for ${gameKey}`);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error starting game:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/games/:gameKey", async (req, res) => {
  try {
    const game = await Game.findOne({ gameKey: req.params.gameKey });
    if (!game) return res.status(404).json({ error: "Game not found" });

    const players = await Character.find({ gameKey: req.params.gameKey });
    res.json({
      hostName: game.hostName,
      players,
      gameStarted: game.gameStarted || false,
    });
  } catch (error) {
    console.error("❌ Error fetching game:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/end-voting", async (req, res) => {
  try {
    const { gameKey } = req.body;
    if (!gameKey) return res.status(400).json({ error: "Game key required" });

    const players = await Character.find({ gameKey, isAlive: true });
    const votes = await Character.aggregate([
      { $match: { gameKey } },
      { $group: { _id: "$name", totalVotes: { $sum: "$votes" } } },
      { $sort: { totalVotes: -1 } },
    ]);

    const getRandomElement = (arr) =>
      arr[Math.floor(Math.random() * arr.length)];

    if (votes.length < players.length) {
      const nonVoters = players.filter(
        (p) => !votes.some((v) => v._id === p.name)
      );
      for (const p of nonVoters) {
        const randomTarget = getRandomElement(
          players.filter((q) => q.name !== p.name)
        );
        await Character.updateOne(
          { gameKey, name: randomTarget.name },
          { $inc: { votes: 1 } }
        );
      }
    }

    const updatedVotes = await Character.aggregate([
      { $match: { gameKey } },
      { $group: { _id: "$name", totalVotes: { $sum: "$votes" } } },
      { $sort: { totalVotes: -1 } },
    ]);

    const eliminatedPlayer = updatedVotes[0]._id;
    await Character.updateOne(
      { gameKey, name: eliminatedPlayer },
      { isAlive: false }
    );
    await Character.updateMany({ gameKey }, { votes: 0 });

    const mafiaCount = await Character.countDocuments({
      gameKey,
      role: "Mafia",
      isAlive: true,
    });
    const civilianCount = await Character.countDocuments({
      gameKey,
      role: { $ne: "Mafia" },
      isAlive: true,
    });

    if (mafiaCount === 0) {
      io.to(gameKey).emit("gameOver", { winner: "Civilians" });
    } else if (mafiaCount >= civilianCount) {
      io.to(gameKey).emit("gameOver", { winner: "Mafia" });
    } else {
      io.to(gameKey).emit("nextRound", { eliminatedPlayer });
    }

    res.json({ eliminatedPlayer });
  } catch (error) {
    console.error("❌ Error in end-voting:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/kill-player", async (req, res) => {
  try {
    const { gameKey, killerName, targetName } = req.body;
    if (!gameKey || !killerName || !targetName)
      return res.status(400).json({ error: "Missing fields" });

    await Character.updateOne(
      { gameKey, name: targetName },
      { isAlive: false }
    );
    const deathMessage = await generateDeathMessage(targetName);

    io.to(gameKey).emit("playerKilled", { targetName, deathMessage });
    res.json({ message: `${targetName} has been eliminated`, deathMessage });
  } catch (error) {
    console.error("❌ Error in kill-player:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/save-player", async (req, res) => {
  try {
    const { gameKey, medicName, targetName } = req.body;
    if (!gameKey || !medicName || !targetName)
      return res.status(400).json({ error: "Missing fields" });

    await Character.updateOne({ gameKey, name: targetName }, { isAlive: true });
    io.to(gameKey).emit("playerSaved", { targetName });

    res.json({ message: `${targetName} has been saved` });
  } catch (error) {
    console.error("❌ Error in save-player:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
