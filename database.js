require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
console.log("MONGO_URI:", process.env.MONGO_URI);

const connectDB = async () => {
  try {
    console.log("🌐 Connecting to MongoDB with URI:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
};

const CharacterSchema = new mongoose.Schema({
  gameKey: String,
  name: String,
  role: {
    type: String,
    enum: ["Civilian", "Medic", "Mafia", "Host"],
    required: true,
  },
  isAlive: { type: Boolean, default: true },
  votes: { type: Number, default: 0 },
});

const Character = mongoose.model("Character", CharacterSchema);

const ScoreSchema = new mongoose.Schema({
  gameKey: String,
  playerName: String,
  score: { type: Number, default: 0 },
  roundsSurvived: { type: Number, default: 0 },
  saves: { type: Number, default: 0 },
});

const Score = mongoose.model("Score", ScoreSchema);

const GameSchema = new mongoose.Schema({
  gameKey: { type: String, unique: true, required: true },
  hostName: String,
  gameStarted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Game = mongoose.model("Game", GameSchema);

module.exports = { connectDB, Character, Score, Game };
