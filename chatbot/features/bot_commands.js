const axios = require('axios');
const totpGen = require('totp-generator');

const msg_lib = require('./lib/msg');
const log_lib = require('./lib/log');

const totpKey = process.env.TOTP_KEY;
const relayUrl = process.env.RELAY_URL;

module.exports = function(controller) {
    // send welcome/usage
    controller.on('conversationUpdate', async(bot, message) => {
        user_name = message.incoming_message.from.name;
        await bot.reply(message, `Hello ${user_name}.`);
        await bot.reply(message, `${msg_lib.usage()}`);
    });

    controller.hears(async (message) => message.text, ['message','direct_message'], async (bot, message) => {
        //parse the message
        c_msg = msg_lib.consume(message.text);
        user_name = message.incoming_message.from.name;
        user_id = message.incoming_message.from.id;
        //if the command is help, send usage and skip the rest
        if(c_msg.command == "help"){
            await bot.reply(message, `${msg_lib.usage()}`);
        } else {
            //this validate the message, generating an appropriate error message if not valid
            valMsg = msg_lib.validate(c_msg);
            if(valMsg.hasOwnProperty("error") && valMsg.error){
                //if we got a bad message, then give the error to the user
                await bot.reply(message, valMsg.errMsg);
            } else {
                //everything is good if we made it here.
                //format a request for the relay, including a totp for the relay to confirm our identity
                var request = {
                    name: user_name,
                    id: user_id,
                    command: c_msg.command,
                    target: c_msg.target,
                    totp: totpGen(totpKey)
                    }
                //send the request with axios
                await axios.post(relayUrl, request)
                .then(async (res) => {
                    //if successful, we log the message to cloudwatchlogs
                    log_lib.send(log_lib.make(c_msg.fulltext, request, res));
                    //and forward the response to the user.
                    //if parsing needs to occur, we would do that here, for now, no parsing.
                    await bot.reply(message, "Body: " + JSON.stringify(res.data));
                })
                .catch(async (error) => {
                    if(error.response){
                        //we reach this block if the relay gives us a bad status code.
                        //we want to log this, and for now, give the body data to the user
                        log_lib.send(log_lib.make(c_msg.fulltext, request, error.response));
                        await bot.reply(message, "Body: " + JSON.stringify(error.response.data));
                    } else if (error.request) {
                        //request was made, but no reponse received.
                        //no log here
                        await bot.reply(message, "Error: Unable to contact server.");
                    } else {
                        //something else happened:
                        //again, no log
                        await bot.reply(message, "Unexpected Error: "+error.message);
                    }
                });
            }
        }
    });
}