// const {Character} = require('database.js'); // Import the Character Schema
import { Character } from './database.js';

async function allocateRoles(names, gameKey) {
    let numPlayers = names.length;
    let role_list = [];
    let already_assigned = 0;
    let civilian_no = 0;
    role_list.push("Medic");
    if (numPlayers <7) {
        role_list.push("Mafia");
        already_assigned = 2;
    } else {
        role_list.push("Mafia");
        role_list.push("Mafia");
        already_assigned = 3;
    }
    
    civilian_no = numPlayers-already_assigned;
    let assignedRoles = []
    
    for (let i = 0; i < (civilian_no); i++) {
        role_list.push("Civilian");
    }
    for (let i = 0; i < (role_list.length); i++) {
        let random_index = Math.floor(Math.random()* role_list.length);
        assignedRoles.push(role_list[random_index]);
        role_list.splice(random_index, 1);
    }

    // Create player objects with roles
    const players = names.map((name, index) => ({
        gameKey,
        name,
        role: assignedRoles[index],
        isAlive: true
    }));

    try {
        const roles = await Character.find(); // Fetch all roles from the database
        console.log("Roles fetched from MongoDB:", roles);
     
     
         // Save the new character to MongoDB
         await Character.insertMany(players)
     
     
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
     }

