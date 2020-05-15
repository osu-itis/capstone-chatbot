const get_user = require('./lib/get_user');
const make_cmd = require('./lib/cmd/make_cmd');

const pp = require('./util/pretty_print_json');

const totpKey = process.env.TOTP_KEY;
const relayUrl = process.env.RELAY_URL;

const http_relay = require('./util/http_relay')(relayUrl, totpKey);

//This file contains message event triggers that match all commands that require communication with the relay.

//Each event contains the following ordered operations:
//get_user parses the user information out of the message
//make_cmd verifies and parses the message text into the object the relay expects
//http_relay makes the request to the relay, logs the result if the relay is contacted, and the event awaits the async function
//bot.reply send the result to the user, using the pp (prettyprint) function to create a string that will display nicely in teams
//the whole thing is contained in a try catch block, if any function has an error, it will throw it and instead send the thrown string to the user prepended by "Error:"

module.exports = function(controller) {

    //listall : List all resources
    controller.hears(new RegExp(/^listall(\s*$|\s+)/i), ['message', 'direct_message'], async (bot, message) => {
        usr = get_user(message);
        try { 
            cmd = make_cmd.listall(message.text);
            let result = await http_relay.post("api/listall", usr, cmd);
            await bot.reply(message, pp(result));
        } catch (e) {
            await bot.reply(message, "Error: " + e);
        }
    });
    
    //regex for valid resource name: [0-9a-zA-Z \\-\\_\\#\\.\\:\\@\\=]+
    //list [vserver] : List resources bound to vserver
    controller.hears(new RegExp(/^listbound(\s*$|\s+)/i), ['message', 'direct_message'], async (bot, message) => {
        usr = get_user(message);
        try { 
            cmd = make_cmd.listbound(message.text);
            let result = await http_relay.post("api/listbound", usr, cmd);
            await bot.reply(message, pp(result));
        } catch (e) {
            await bot.reply(message, "Error: " + e);
        }
    });

    //list : Lists vservers
    controller.hears(new RegExp(/^list(\s*$|\s+)/i), ['message', 'direct_message'], async (bot, message) => {
        usr = get_user(message);
        try { 
            cmd = make_cmd.list(message.text);
            let result = await http_relay.post("api/list", usr, cmd);
            await bot.reply(message, pp(result));
        } catch (e) {
            await bot.reply(message, "Error: " + e);
        }
    });

    //status [resource] : Display the status of the resource
    controller.hears(new RegExp(/^status(\s*$|\s+)/i), ['message', 'direct_message'], async (bot, message) => {
        usr = get_user(message);
        try { 
            cmd = make_cmd.status(message.text);
            let result = await http_relay.post("api/status", usr, cmd);
            await bot.reply(message, pp(result));
        } catch (e) {
            await bot.reply(message, "Error: " + e);
        }
    });

    //enable [resource] : Enable a resource
    controller.hears(new RegExp(/^enable(\s*$|\s+)/i), ['message', 'direct_message'], async (bot, message) => {
        usr = get_user(message);
        try { 
            cmd = make_cmd.enable(message.text);
            let result = await http_relay.post("api/enable", usr, cmd);
            await bot.reply(message, pp(result));
        } catch (e) {
            await bot.reply(message, "Error: " + e);
        }
    });

    //disable [resource] [time] : Disable a resource
    controller.hears(new RegExp(/^disable(\s*$|\s+)/i), ['message', 'direct_message'], async (bot, message) => {
        usr = get_user(message);
        try { 
            cmd = make_cmd.disable(message.text);
            let result = await http_relay.post("api/disable", usr, cmd);
            await bot.reply(message, pp(result));
        } catch (e) {
            await bot.reply(message, "Error: " + e);
        }
    });

    //disablenow [resource] [time] : Disable a resource
    controller.hears(new RegExp(/^disablenow(\s*$|\s+)/i), ['message', 'direct_message'], async (bot, message) => {
        usr = get_user(message);
        try { 
            cmd = make_cmd.disablenow(message.text);
            let result = await http_relay.post("api/disablenow", usr, cmd);
            await bot.reply(message, pp(result));
        } catch (e) {
            await bot.reply(message, "Error: " + e);
        }
    });
}