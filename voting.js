const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;
const uri = process.env.MONGO_URI;

app.use(cors());
app.use(express.json()); // Enable JSON parsing
app.use(express.static(path.join(__dirname, 'public')));

let db, playersCollection;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db("gameDB");
        playersCollection = db.collection("players");
        console.log("Connected to MongoDB");
    })
    .catch(error => console.error(error));

// Endpoint to get assigned players
app.get('/players', async (req, res) => {
    try {
        const players = await playersCollection.find().toArray();
        const assignedPlayers = players.map(player => ({
            name: player.name,
            votes: player.votes || 0,
        }));
        res.json(assignedPlayers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch players" });
    }
});

// Endpoint to handle voting
app.post('/vote', async (req, res) => {
    try {
        const { voter, target } = req.body;
        const voterPlayer = await playersCollection.findOne({ name: voter });
        if (!voterPlayer || !voterPlayer.alive) {
            return res.status(400).json({ error: "Invalid or dead voter" });
        }
        const targetPlayer = await playersCollection.findOne({ name: target });
        if (!targetPlayer || !targetPlayer.alive) {
            return res.status(400).json({ error: "Cannot vote for a dead player" });
        }
        await playersCollection.updateOne(
            { name: target, alive: true },
            { $inc: { votes: 1 } }
        );
        res.json({ message: "Vote recorded" });
    } catch (error) {
        res.status(500).json({ error: "Failed to register vote" });
    }
});

// Endpoint to process round results
app.post('/process-round', async (req, res) => {
    try {
        const players = await playersCollection.find({ alive: true }).toArray();
        let highestVotes = 0;
        let potentialEliminations = [];

        players.forEach(player => {
            if (player.votes > highestVotes) {
                highestVotes = player.votes;
                potentialEliminations = [player.name];
            } else if (player.votes === highestVotes) {
                potentialEliminations.push(player.name);
            }
        });

        if (potentialEliminations.length === 1) {
            await playersCollection.updateOne(
                { name: potentialEliminations[0] },
                { $set: { alive: false, votes: 0 } }
            );
        } else {
            console.log("Tie detected. No one is eliminated.");
        }

        await playersCollection.updateMany({}, { $set: { votes: 0 } });
        res.json({ message: "Round processed", eliminated: potentialEliminations.length === 1 ? potentialEliminations[0] : "None (tie)" });
    } catch (error) {
        res.status(500).json({ error: "Failed to process round" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
