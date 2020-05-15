const get_user = require('./lib/get_user');
const make_cmd = require('./lib/cmd/make_cmd');

const usage = require('./lib/usage');

const logGroup = 'NitroChatbot';
const auth_log_lib = require('./util/cwlogs')(logGroup);

//Each of these events below match potential events that may be triggered by the user.
//This file contains commands that do not need to query the Relay.
//Each event matches a support command with a regex.
module.exports = function (controller) {

    //help : Shows usage text
    controller.hears(new RegExp(/^help(\s*$|\s+)/i), ['message', 'direct_message'], async (bot, message) => {
        try {
            cmd = make_cmd.help(message.text);
            text = cmd.target == "all" ? usage.all() : usage.get(cmd.target);
            await bot.reply(message, text);
        } catch (e) {
            await bot.reply(message, "Error: " + e);
        }
    });

    //request-auth : Sends log message to admin
    controller.hears(new RegExp(/^request\-auth(\s*$|\s+)/i), ['message', 'direct_message'], async (bot, message) => {
        usr = get_user(message);
        try {
            cmd = make_cmd.reqauth(message.text);
            await bot.reply(message, "A log message with your request has been sent to the administrator")
        } catch (e) {
            await bot.reply(message, "Error: " + e);
        }
        //Sends a log message to the log stream "RequestedAuths" with the following object format:
        auth_log_lib.send('RequestedAuths' ,{
            "ATTENTION": cmd.command,
            "Name": usr.name,
            "ID": usr.id,
            "Full text": cmd.target
        });
    });
}