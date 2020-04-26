//IF the bot is to run on a different platform, a different module may need to be written to extract user information
const teams = require('./teams');

//Returns an object with 2 fields
//{ name: "Users plaintext name", 
// id: "user's unique identifier" }
module.exports = (msg) => {
    return teams.getUser(msg);
}