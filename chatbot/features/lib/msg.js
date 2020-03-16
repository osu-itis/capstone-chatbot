module.exports = {
    /*
        Returns a string with the usage information
    */
     usage: () => {
        return  'Usage:'+'\n\n'+
        '\thelp'+'\n\n'+
            'Display this usage message'+'\n\n'+
        '\tlist'+'\n\n'+
            'List all vServers'+'\n\n'+
        '\tlist [vserver]'+'\n\n'+
            'List all bound resources for a vServer'+'\n\n'+
        '\tlistall'+'\n\n'+
            'List all resources'+'\n\n'+
        '\tstatus [resource]'+'\n\n'+
            'Display the status of a resource'+'\n\n'+
        '\tenable [resource]'+'\n\n'+
            'Enable a resource by name'+'\n\n'+
        '\tdisable [resource]'+'\n\n'+
            'Gently disable a resource by name'+'\n\n'+
        '\tdisablenow [resource]'+'\n\n'+
            'Immediately disable a resource by name'+'\n\n'+
        '\trequest-auth [message to admin]'+'\n\n'+
            'Request authorization by sending a log message to the admin';
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
                if(msg.length > 2){
                    retVal.error = true;
                    retVal.errMsg = 'Too many arguments for command: "' + msg.command + '".';
                } else {
                    retVal.error = false;
                    retVal.msg = msg;
                }
                break;
            case "listall":
                if(msg.length > 1){
                    retVali.error = true;
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
        return retVal;
     }
 }