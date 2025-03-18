const express = require("express");
const cors = require("cors");
const http = require("http"); // ✅ Needed for WebSockets
const { Server } = require("socket.io"); // ✅ Import Socket.io
const { connectDB, Character, Game } = require("./database");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// ✅ WebSocket Connection Handling
io.on("connection", (socket) => {
  console.log(`✅ New WebSocket connection: ${socket.id}`);

  // ✅ Listen for players joining a game
  socket.on("joinRoom", (gameKey) => {
    socket.join(gameKey);
    console.log(`✅ Socket ${socket.id} joined room: ${gameKey}`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ WebSocket disconnected: ${socket.id}`);
  });
});

// ✅ Route to create a new game
app.post("/create-game", async (req, res) => {
  try {
    const { hostName } = req.body;
    if (!hostName)
      return res.status(400).json({ error: "Host name is required" });

    const gameKey = Math.random().toString(36).substr(2, 6).toUpperCase();

    // ✅ Save the new game
    const newGame = new Game({ gameKey, hostName });
    await newGame.save();

    // ✅ Check if the host is already added
    const existingHost = await Character.findOne({
      gameKey,
      name: `[Host] ${hostName}`,
    });
    if (!existingHost) {
      const hostPlayer = new Character({
        gameKey,
        name: `[Host] ${hostName}`,
        role: "Host",
      });
      await hostPlayer.save();
    }

    console.log(`✅ New game created: ${gameKey} by ${hostName}`);

    return res.json({ gameKey });
  } catch (error) {
    console.error("❌ Error creating game:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Route to join a game
app.post("/join-game", async (req, res) => {
  try {
    const { gameKey, playerName } = req.body;
    if (!gameKey || !playerName)
      return res
        .status(400)
        .json({ error: "Game key and player name are required" });

    // Check if game exists
    const game = await Game.findOne({ gameKey });
    if (!game) return res.status(404).json({ error: "Game not found" });

    // Add the player to the database
    const newPlayer = new Character({
      gameKey,
      name: playerName,
      role: "Civilian",
    });
    await newPlayer.save();

    console.log(`✅ Player ${playerName} joined game ${gameKey}`);

    // ✅ Fetch updated player list
    const updatedPlayers = await Character.find({ gameKey });

    // ✅ Notify all clients, including host, of the update
    io.to(gameKey).emit("updatePlayers", { players: updatedPlayers });

    res.json({ message: "Joined successfully" });
  } catch (error) {
    console.error("❌ Error joining game:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Use HTTP Server Instead of app.listen
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

const allocateRoles = require("./role_allocation"); // ✅ Corrected

app.post("/start-game", async (req, res) => {
  try {
    const { gameKey } = req.body;
    if (!gameKey)
      return res.status(400).json({ error: "Game key is required" });

    console.log(`🚀 Starting game for ${gameKey}`);

    // Fetch players
    const players = await Character.find({ gameKey });
    if (players.length < 3)
      return res.status(400).json({ error: "Not enough players to start" });

    // ✅ Assign roles
    await allocateRoles(
      players.map((p) => p.name),
      gameKey
    );

    // ✅ Fetch updated player roles
    const updatedPlayers = await Character.find({ gameKey });

    // ✅ Notify players of their roles
    io.to(gameKey).emit("gameStarted", { players: updatedPlayers });

    // ✅ Log before sending phase update
    console.log(`🔄 Emitting phase update: MiniGames for game ${gameKey}`);

    // ✅ Begin first phase: Mini-Games & Kill Selection
    io.to(gameKey).emit("phaseUpdate", {
      phase: "MiniGames",
      players: updatedPlayers,
    });

    res.json({ message: "Game started successfully!" });
  } catch (error) {
    console.error("❌ Error starting game:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const generateDeathMessage = require("./deathmessage");

app.post("/kill-player", async (req, res) => {
  try {
    const { gameKey, killerName, targetName } = req.body;

    if (!gameKey || !killerName || !targetName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Check if target exists
    const target = await Character.findOne({ gameKey, name: targetName });
    if (!target) {
      return res.status(404).json({ error: "Target not found" });
    }

    // ✅ Mark the player as dead
    await Character.updateOne(
      { gameKey, name: targetName },
      { isAlive: false }
    );

    // ✅ Generate a death message
    const deathMessage = await generateDeathMessage(targetName);

    console.log(`💀 ${killerName} killed ${targetName} in game ${gameKey}`);

    // ✅ Notify all players about the death message
    io.to(gameKey).emit("playerKilled", { targetName, deathMessage });

    res.json({ message: `${targetName} has been eliminated`, deathMessage });
  } catch (error) {
    console.error("❌ Error processing kill:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/save-player", async (req, res) => {
  try {
    const { gameKey, medicName, targetName } = req.body;

    if (!gameKey || !medicName || !targetName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Check if the target exists
    const target = await Character.findOne({ gameKey, name: targetName });
    if (!target) {
      return res.status(404).json({ error: "Target not found" });
    }

    // ✅ Mark the player as "saved" (so they can't be killed this round)
    await Character.updateOne({ gameKey, name: targetName }, { isAlive: true });

    console.log(`🛡️ ${medicName} saved ${targetName} in game ${gameKey}`);

    // ✅ Notify all players via WebSocket
    io.to(gameKey).emit("playerSaved", { targetName });

    res.json({ message: `${targetName} has been saved` });
  } catch (error) {
    console.error("❌ Error processing save:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/games/:gameKey", async (req, res) => {
  try {
    const { gameKey } = req.params;
    const game = await Game.findOne({ gameKey });

    if (!game) return res.status(404).json({ error: "Game not found" });

    const players = await Character.find({ gameKey });

    console.log("📢 Game Data Sent to Frontend:", {
      hostName: `"${game.hostName.trim()}"`,
      players,
    });

    res.json({
      hostName: game.hostName.trim().toLowerCase(), // ✅ Ensure clean & lowercase host name
      players,
    });
  } catch (error) {
    console.error("❌ Error fetching game details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

setTimeout(async () => {
  try {
    const players = await Character.find({ gameKey, isAlive: true });
    const totalVotes = await Character.aggregate([
      { $match: { gameKey } },
      { $group: { _id: "$name", totalVotes: { $sum: "$votes" } } },
      { $sort: { totalVotes: -1 } },
    ]);

    if (totalVotes.length < players.length) {
      // ✅ Assign random votes to non-voters
      const nonVoters = players.filter(
        (p) => !totalVotes.some((v) => v._id === p.name)
      );
      nonVoters.forEach(async (player) => {
        const randomTarget = getRandomElement(
          players.filter((p) => p.name !== player.name)
        );
        await Character.updateOne(
          { gameKey, name: randomTarget.name },
          { $inc: { votes: 1 } }
        );
        console.log(
          `🤖 Auto-voted: ${player.name} voted for ${randomTarget.name}`
        );
      });
    }

    // ✅ Continue with normal vote counting
    const eliminatedPlayer = totalVotes[0]._id;
    await Character.updateOne(
      { gameKey, name: eliminatedPlayer },
      { isAlive: false }
    );

    console.log(`💀 ${eliminatedPlayer} has been voted out`);

    // ✅ Reset votes
    await Character.updateMany({ gameKey }, { votes: 0 });

    // ✅ Check win condition
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
  } catch (error) {
    console.error("❌ Error in auto-voting:", error);
  }
}, 30000); // ⏳ Auto-vote after 30 seconds
