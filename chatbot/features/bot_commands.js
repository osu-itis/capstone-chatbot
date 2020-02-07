const axios = require('axios');

 /*
    Returns a string with the usage information
 */
 function usage_text() {
    return "Usage: status [vserver || pool] remove [vserver] add [vserver]"
 }
/*
Accepts a string (msg)
Returns an object with
 .fulltext = original text
 .length = number of space-delimited terms
 .command = first term
 .target = second term
 .terms = the remaining terms as an array of strings
*/
 function consumeText(msg) {
    let c_msg = {}
    c_msg.fulltext = msg;
    c_msg.terms = msg.split(" ");
    c_msg.length = c_msg.terms.length;
    if(c_msg.terms[0]){
        c_msg.command = c_msg.terms.shift().toLowerCase();
    }
    if(c_msg.terms[0]){
        c_msg.target = c_msg.terms.shift();
    }
    return c_msg;
 }

module.exports = function(controller) {
    // send welcome/usage
    controller.on('conversationUpdate', async(bot, message) => {
        user_name = message.incoming_message.from.name;
        await bot.reply(message, `Hello ${user_name}.`);
        await bot.reply(message, `${usage_text()}`);
    });

    controller.hears(async (message) => message.text, ['message','direct_message'], async (bot, message) => {
        //parse the message here
        c_msg = consumeText(message.text);
        user_name = message.incoming_message.from.name;
        user_id = message.incoming_message.from.id;
        //the msg must be exactly 2 terms currently
        if(c_msg.length == 2){
            //the available commands, currently placeholder replies
            switch(c_msg.command){
                case "status":
                    await axios.post(process.env.RELAY_URL, {
                        name: user_name,
                        id: user_id,
                        command: c_msg.command,
                        target: c_msg.target
                        })
                        .then(async (res) => {
                            await bot.reply(message, "Body: " + JSON.stringify(res.body));
                        })
                        .catch(async (error) => {
                            await bot.reply(message, "Error contacting Relay.");
                        })                  
                    break;
                case "remove":
                    await bot.reply(message, `${user_name} wants to remove ${c_msg.target} from the pool`);
                    break;
                case "add":
                    await bot.reply(message, `${user_name} wants to add ${c_msg.target} to the pool`);
                    break;
                default:
                    await bot.reply(message, `Command "${c_msg.command}" not recognized.`);
                    await bot.reply(message, `${usage_text()}`);
            }
        } else {
            await bot.reply(message, `Command: "${c_msg.fulltext}" not recognized.`);
            await bot.reply(message, `${usage_text()}`);
        }
    });
}