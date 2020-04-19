//This module is intended to hold any functionality that may be unique to MS Teams

module.exports = {
    //Parses the user's name and id from an incoming message based on Teams incoming message format
    //If the object has the aadObjectId property, then it's running production and can get the user's real MS unique ID
    //Returns an object with 2 properties, Name as String, and ID as string ( formatted hex as: 8-4-4-4-12 )
    getUser: (msg) => {
        let sender = msg.incoming_message.from;
        return {
            name: sender.name,
            id: sender.hasOwnProperty('aadObjectId') ? sender.aadObjectId : sender.id 
        };
    }
}