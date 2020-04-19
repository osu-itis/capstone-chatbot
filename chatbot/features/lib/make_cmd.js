//Library with helper functions, functions described within their file
lib = require('./cmd_lib');

//Each function within this module defines the allowed input for each command
//At this stage, we know the command the user is using due to the regex matching on message events
//Each function has a comment stating the allowed formats per command type
module.exports = {
    //list: no parameters
    list: (fulltext) => {
        text = lib.clean(fulltext);
        lib.test_term_count(text.length, 1, 1);
        return {
            command: text[0]
        };
    },
    //listall: no paramters
    listall: (fulltext) => {
        text = lib.clean(fulltext);
        lib.test_term_count(text.length, 1, 1);
        return {
            command: text[0]
        };
    },
    //listbound: 1 parameter w/ allowed characters for a resource name (see lib)
    listbound: (fulltext) => {
        text = lib.clean(fulltext);
        lib.test_term_count(text.length, 2, 2);
        target = lib.test_target_param(text[1]);
        return {
            command: text[0],
            target: target
        };
    },
    //status: 1 parameter w/ allowed characters for a resource name (see lib)
    status: (fulltext) => {
        text = lib.clean(fulltext);
        lib.test_term_count(text.length, 2, 2);
        target = lib.test_target_param(text[1]);
        return {
            command: text[0],
            target: target
        };
    },
    //enable: 1 parameter w/ allowed characters for a resource name (see lib)
    enable: (fulltext) => {
        text = lib.clean(fulltext);
        lib.test_term_count(text.length, 2, 2);
        target = lib.test_target_param(text[1]);
        return {
            command: text[0],
            target: target
        };
    },
    //disable: 1-2 parameters:
        //First: String w/ allowed characters for a resource name (see lib) [Required]
        //Second: Integer w/ characters 0-9, no decimals [Optional, Default: 0]
    disable: (fulltext) => {
        text = lib.clean(fulltext);
        lib.test_term_count(text.length, 2, 3);
        target = lib.test_target_param(text[1]);
        //if there's 2 params, test the 2nd one and set it to delay, otherwise set it to 0
        delay = text.length == 3 ? lib.test_int_param(text[2]) : 0;
        return {
            command: text[0],
            target: target,
            delay: delay
        };
    },
    //help: 0-1 parameters: parameter must be an available command (set in regex within cmd_lib) [Optional]
    help: (fulltext) => {
        text = lib.clean(fulltext);
        lib.test_term_count(text.length, 1, 2);
        target = text.length == 2 ? lib.test_command_param(text[1]) : "all";
        return {
            command: text[0],
            target: target
        };
    },
    //request-auth: 0 - 1 param. Param is a message string that may contain spaces [Optional]
    //              As such, the message is reconstructed from index 1 to text.length
    'request-auth': (fulltext) => {
        text = lib.clean(fulltext);
        target = "";
        if(text.length >= 2) {
            for(i = 1; i<=text.length; i++) {
                target = target + text[i] + " ";
            }
            target = target.slice(0, -1);
        }
        return {
            command: text[0],
            target: target
        };
    }
};