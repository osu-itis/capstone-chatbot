const get_user = require('./lib/get_user');
const make_cmd = require('./lib/cmd/make_cmd');

const usage = require('./lib/usage');

const logGroup = 'NitroChatbot';
const logStream = 'RequestedAuths'
const log_lib = require('./util/cwlogs')(logGroup, logStream);

module.exports = function (controller) {

    //help : Shows usage text
    controller.hears(new RegExp(/^help\s*/), ['message', 'direct_message'], async (bot, message) => {
        try {
            cmd = make_cmd.help(message.text);
            text = cmd.target == "all" ? usage.all() : usage.get(cmd.target);
            await bot.reply(message, text);
        } catch (e) {
            await bot.reply(message, "Error: " + e);
        }
    });

    //request-auth : Sends log message to admin
    controller.hears(new RegExp(/^request\-auth\s*/), ['message', 'direct_message'], async (bot, message) => {
        usr = get_user(message);
        try {
            cmd = make_cmd.reqauth(message.text);
            await bot.reply(message, "A log message with your request has been sent to the administrator")
        } catch (e) {
            await bot.reply(message, "Error: " + e);
        }
        log_lib.send({
            "ATTENTION": cmd.command,
            "Name": usr.name,
            "ID": usr.id,
            "Full text": cmd.target
        });
    });
}