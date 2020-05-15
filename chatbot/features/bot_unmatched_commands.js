//Since this file is last alphabetically, it's events are trigger very last.
//Since Botkit only triggers the first matching 'hears' event, this only runs if no other matches are found.

module.exports = function(controller) {

    //Catch-all event for unmatched messages from user
    //This will display a generic error message to the user, suggesting they instead view the usage text with "help".
    controller.hears(async (message) => message.text, ['message', 'direct_message'], async (bot, message) => {
        await bot.reply(message, 'Error: Command not recognized. Try again or type "help" to see the full usage text.');
    });
}