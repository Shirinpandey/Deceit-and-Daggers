const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 3000;
const uri = process.env.MONGODB_URI;

const allowedOrigins = [
  "https://deceit-and-daggers.vercel.app",
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

let db, playersCollection;

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    db = client.db("deceit-and-daggers"); // Replace with your DB name
    playersCollection = db.collection("characters"); // Replace with your Collection name
    console.log("Connected to MongoDB");
  })
  .catch((error) => console.error(error));

// Endpoint to fetch all players
app.get("/characters", async (req, res) => {
  try {
    const characters = await playersCollection.find().toArray();
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch players" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
