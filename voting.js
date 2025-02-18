const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;
const uri = "your_mongodb_connection_string"; // Replace with your MongoDB connection string

// Enable CORS
app.use(cors());

// Serve static files (including your HTML file)
app.use(express.static(path.join(__dirname, 'public')));

let db, playersCollection;

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db("gameDB"); // Replace with your DB name
        playersCollection = db.collection("players"); // Replace with your Collection name
        console.log("Connected to MongoDB");
    })
    .catch(error => console.error(error));

// Function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Endpoint to get randomly assigned players
app.get('/players', async (req, res) => {
    try {
        const players = await playersCollection.find().toArray();
        const roles = players.map(player => player.role);
        shuffleArray(roles);

        const assignedPlayers = players.map((player, index) => ({
            name: player.name,
            role: roles[index]
        }));

        res.json(assignedPlayers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch players" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


