module.exports = {

    //Expects a string
    //Returns an array of terms
    //This strips all extra whitespace
    clean: (fulltext) => {
        if(typeof fulltext == "string"){
            return fulltext
                    .replace(/\s+/g, ' ')
                    .trim()
                    .split(" ");
        } else {
            throw "clean(string) failed. Param not a string."
        }
    },

    //Expects 3 ints
    //If outside bounds, throws an error
    test_term_count: (x, min, max) => {
        if(x < Math.min(min, max)) throw "Too few arguments";
        else if(x > Math.max(min, max)) throw "Too many arguments";
        else return true;
    },

    //test target param
    //if it has a bad character, then throw an error
    //otherwise it returns the param
    test_target_param: (param) => {
        //The netscaler only allows the following characters for a resource name:
        // 0-9a-zA-Z -_#.:@=
        //this regex covers that:
        if(/^[0-9a-zA-Z \-\_\#\.\:\@\=]+$/.test(param)) {
            return param;
        } else {
            throw "Invalid character in target parameter";
        }
    },

    //test help-command param
    //if param doesn't match an available command, then throw an error
    //otherwise return the param
    //NOTE: If adding a new command to the usage msg, it needs to be added to this regex
    test_command_param: (param) => {
        if(/^(list|listall|listbound|status|enable|disable|help|request\-auth)$/.test(param)) {
            return param;
        } else {
            throw "Invalid command";
        }
    },

    //test number param
    //if the param doesn't contain only numbers [0-9], then it throws an error
    //otherwise it returns the string as a double
    test_int_param: (param) => {
        if(/^[0-9]+$/.test(param)) {
            return parseInt(param);
        } else {
            throw "Invalid parameter, integer expected";
        }
    }
}