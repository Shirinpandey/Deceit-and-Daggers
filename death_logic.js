import { Character } from './database.js';

async function kill_player(votes_dictionary){
    let max_votes = 0 
    let highest_voted = -1
    let tie_flag = false 
    let num_players = votes_dictionary.length
    for (let i=0; i<num_players; i++)
        if (votes_dictionary[i].votes > max_votes){
            tie_flag = false
            max_votes = votes_dictionary
            highest_voted = i
        } else if (votes_dictionary[i].votes = max_votes){
            tie_flag = true
        }
        if (tie_flag == false && highest_voted!=-1){
            markCharacterAsDead(votes_dictionary[highest_voted].name)
        } else {
            console.log('Tie, next round begins')
        }
}

async function markCharacterAsDead(name) {
    try {
      const updatedCharacter = await Character.findOneAndUpdate(
        { name: name },             // Find character by name
        { $set: { isAlive: false } }, // Set the `isAlive` property to false
        { new: true }               // Return the updated document
      );
      
      if (updatedCharacter) {
        console.log(`Character ${name} is now marked as dead.`);
        console.log(updatedCharacter);
      } else {
        console.log(`Character ${name} not found.`);
      }
    } catch (err) {
      console.error("Error updating character:", err);
    }
  }
  