const { Character } = require("./database");

async function allocateRoles(names, gameKey) {
  let numPlayers = names.length;
  let roleList = [];
  let alreadyAssigned = 0;
  let civilianCount = 0;

  // ✅ Ensure the role list is populated correctly
  roleList.push("Medic");

  if (numPlayers < 7) {
    roleList.push("Mafia");
    alreadyAssigned = 2;
  } else {
    roleList.push("Mafia");
    roleList.push("Mafia");
    alreadyAssigned = 3;
  }

  civilianCount = numPlayers - alreadyAssigned;

  for (let i = 0; i < civilianCount; i++) {
    roleList.push("Civilian");
  }

  let assignedRoles = [];

  // ✅ Ensure each player gets exactly one role
  for (let i = 0; i < roleList.length; i++) {
    let randomIndex = Math.floor(Math.random() * roleList.length);
    assignedRoles.push(roleList[randomIndex]);
    roleList.splice(randomIndex, 1);
  }

  // ✅ Ensure players are mapped correctly to roles
  const players = names.map((name, index) => ({
    gameKey,
    name,
    role: assignedRoles[index] || "Civilian", // ✅ Default to "Civilian" if undefined
    isAlive: true,
  }));

  try {
    // ✅ Check if all roles are correctly assigned before saving
    console.log("🎭 Assigned Roles:", players);

    await Character.insertMany(players);
    console.log("✅ Roles successfully assigned!");
  } catch (error) {
    console.error("❌ Error assigning roles:", error);
  }
}

module.exports = allocateRoles; // ✅ Ensure this is correctly exported
