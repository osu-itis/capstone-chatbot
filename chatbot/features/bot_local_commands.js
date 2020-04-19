const get_user = require('./lib/get_user');
const make_cmd = require('./lib/make_cmd');

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
    controller.hears(new RegExp(/^request\\-auth\s*/), ['message', 'direct_message'], async (bot, message) => {
        log_lib.send({
            "ATTENTION": c_msg.command,
            "Name": user_name,
            "UUID": user_id,
            "Full text": c_msg.fulltext
        });
    });
}