const msg_lib = require('./bot_local_commands');
const get_user = require('./lib/get_user');
const make_cmd = require('./lib/make_cmd');

const pp = require('./lib/prettyprint');

const totpKey = process.env.TOTP_KEY;
const relayUrl = process.env.RELAY_URL;

const http_relay = require('./util/http_relay')(relayUrl, totpKey);

module.exports = function(controller) {

    //list : Lists vservers
    controller.hears(new RegExp(/^list\s*/), ['message', 'direct_message'], async (bot, message) => {
        usr = get_user(message);
        try { 
            cmd = make_cmd.list(message.text);
        } catch (e) {
            await bot.reply(message, "Error: " + e);
        }
        result = await http_relay("api/list", usr, cmd);
        await bot.reply(message, pp(cmd, result));
        
    });

    //listall : List all resources
    controller.hears(new RegExp(/^listall\s*/), ['message', 'direct_message'], async (bot, message) => {
        usr = get_user(message);
        try { 
            cmd = make_cmd.listall(message.text);
            result = await http_relay("api/listall", usr, cmd);
            await bot.reply(message, pp(cmd, result));
        } catch (e) {
            await bot.reply(message, "Error: " + e);
        }
    });
    
    //regex for valid resource name: [0-9a-zA-Z \\-\\_\\#\\.\\:\\@\\=]+
    //list [vserver] : List resources bound to vserver
    controller.hears(new RegExp(/^listbound\s*/), ['message', 'direct_message'], async (bot, message) => {
        usr = get_user(message);
        try { 
            cmd = make_cmd.listbound(message.text);
            result = await http_relay("api/list", usr, cmd);
            await bot.reply(message, pp(cmd, result));
        } catch (e) {
            await bot.reply(message, "Error: " + e);
        }
    });

    //status [resource] : Display the status of the resource
    controller.hears(new RegExp(/^status\s*/), ['message', 'direct_message'], async (bot, message) => {
        usr = get_user(message);
        try { 
            cmd = make_cmd.status(message.text);
            result = await http_relay("api/list", usr, cmd);
            await bot.reply(message, pp(cmd, result));
        } catch (e) {
            await bot.reply(message, "Error: " + e);
        }
    });

    //enable [resource] : Enable a resource
    controller.hears(new RegExp(/^enable\s*/), ['message', 'direct_message'], async (bot, message) => {
        usr = get_user(message);
        try { 
            cmd = make_cmd.enable(message.text);
            result = await http_relay("api/list", usr, cmd);
            await bot.reply(message, pp(cmd, result));
        } catch (e) {
            await bot.reply(message, "Error: " + e);
        }
    });

    //disable [resource] [time] : Disable a resource
    controller.hears(new RegExp(/^disable\s*/), ['message', 'direct_message'], async (bot, message) => {
        usr = get_user(message);
        try { 
            cmd = make_cmd.disable(message.text);
            result = await http_relay("api/list", usr, cmd);
            await bot.reply(message, pp(cmd, result));
        } catch (e) {
            await bot.reply(message, "Error: " + e);
        }
    });
}