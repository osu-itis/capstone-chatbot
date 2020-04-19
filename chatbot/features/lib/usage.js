//This object stores all the usage text information. 
//If adding a new command, add it here AND allow it in the regex within make_cmd_lib
const usage = {
    'help': {
        comm: 'help [command: optional]',
        text: 'Display this usage message, or for a single command (optional)'
    },
    'list': {
        comm: 'list',
        text: 'List all vServers'
    },
    'listall': {
        comm: 'listall',
        text: 'List all resources'
    },
    'listbound': {
        comm: 'listbound <resource>',
        text: 'List all resources bound to another resource'
    },
    'status': {
        comm: 'status <resource>',
        text: 'Display the status of a resource'
    },
    'enable': {
        comm: 'enable <resource>',
        text: 'Enable a resource by name'
    },
    'disable': {
        comm: 'disable <resource> [delay: optional, default=0]',
        text: 'Disable a resource by name with an optional delay (seconds). '
    },
    'request-auth':  {
        comm: 'request-auth [message: optional]',
        text: 'Request authorization by sending a log event to the admin, (message optional)'
    }
}

module.exports = {

    //Returns a string with the full usage text
    all: () => {
        result = 'Usage:\n\n';
        for(command in usage) {
            result = result + 
                '\t'+usage[command].comm+'\n\n'+
                usage[command].text+'\n\n';
        }
        return result.slice(0, -2);
    },

    //Returns a string with usage text for a single command
    //This input is previous checked with make_cmd
    //BUT, it should return error text if a command doesn't have a usage text
    get: (command) => {
        if(usage.hasOwnProperty(command)) {
            return 'Usage:\n\n'+
                '\t'+usage[command].comm+'\n\n'+
                usage[command].text;
        } else {
            return command + ' does not have a usage text';
        }
    }
}