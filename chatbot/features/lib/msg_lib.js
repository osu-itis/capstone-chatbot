module.exports = {
    /*
        Returns a string with the usage information
    */
     usage: () => {
        return  'Usage:'+'\n\n'+
        'list'+'\n\n'+
            '\tList all available resources'+
        'status [resource-name]'+'\n\n'+
            '\tDisplay the status of a resource'+
        'enable [service-name]'+'\n\n'+
            '\tEnable a service by name'+
        'disable [service-name]'+
            '\tGently disable a service by name'+
        'disablenow [service-name]'+
            '\tImmediately disable a service by name';
     },
     /* Accepts a string (msg)
        Returns an object with
        .fulltext = original text
        .length = number of space-delimited terms
        .command = first term
        .target = second term
        .terms = the remaining terms as an array of strings
    */
     consume: (msg) => {
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
     },
     /* Accept a message object, and validates it according to the requirements scheme.
        If a message is invalid, then retVal.error is set to true and an appropriate message is placed in retVal.errMsg
     */
     validate: (msg) => {
        let retVal = {};
        switch(msg.command){
            case "list":
                if(msg.length > 1){
                    retVal.error = true;
                    retVal.errMsg = 'Too many arguments for command: "' + msg.command + '".';
                } else {
                    retVal.error = false;
                    retVal.msg = msg;
                }
                break;
            case "status":
            case "enable":
            case "disable":
            case "disablenow":
                if(msg.length < 2){
                    retVal.error = true;
                    retVal.errMsg = 'Not enough arguments for command: "' + msg.command + '".';
                } else if (msg.length >2) {
                    retVal.error = true;
                    retVal.errMsg = 'Too many arguments for command: "' + msg.command + '".';
                } else {
                    retVal.error = false;
                    retVal.msg = msg;
                }
                break;
            default:
                retVal.error = true;
                retVal.errMsg = 'Command: "' + msg.command +'" not recognized.' 
        }
     }
 }