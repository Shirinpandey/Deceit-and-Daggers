const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Serve static files (including your HTML file)
app.use(express.static(path.join(__dirname, 'public')));

// Sample player data
const players = [
    { name: "A", role: "Killer" },
    { name: "B", role: "Medic" },
    { name: "C", role: "Civilian" },
    { name: "D", role: "Civilian" }
];

// Endpoint to get players
app.get('/players', (req, res) => {
    res.json(players);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
