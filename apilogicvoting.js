const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;
const uri = "your_mongodb_connection_string"; // Replace with your MongoDB connection string

app.use(cors()); // Enable CORS for frontend access
app.use(express.json());

let db, playersCollection;

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db("gameDB"); // Replace with your DB name
        playersCollection = db.collection("players"); // Replace with your Collection name
        console.log("Connected to MongoDB");
    })
    .catch(error => console.error(error));

// Endpoint to fetch all players
app.get('/players', async (req, res) => {
    try {
        const players = await playersCollection.find().toArray();
        res.json(players);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch players" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
