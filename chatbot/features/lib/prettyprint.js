module.exports = (msg, response) => {
    switch(msg.command){
        case "list":
            if(msg.hasOwnProperty("target")){
                var output = "Resources Bound To: " + response.name + "\n\n";
                for(i in response.sgmem){
                    output += "Service Group: "+response.sgmem[i].servicegroup 
                        + " Server Name:" + response.sgmem[i].servername + "\n\n";
                }
                for(i in response.service){
                    output += "Service Name: " + response.service[i].name + "\n\n";
                }
                return output;
            } else {
                var output = "vServers: ";
                for(i in response.vserver){
                    output += response.vserver[i].name + ", ";
                }
                output = output.slice(0, -2);
                return output;
            }           

        case "listall":
            var output = "vServers: ";
            for(i in response.vservers){
                output += response.vservers[i] + ", ";
            }
            if (output.substr(output.length-2, 1) == ",")
                output = output.slice(0, -2);
            output += "\n\n Service Groups: ";
            for(i in response.servicegroups){
                output += response.servicegroups[i] + ", ";
            }
            if (output.substr(output.length-2, 1) == ",")
                output = output.slice(0, -2);
            output += "\n\n Services: ";
            for(i in response.services){
                output += response.services[i] + ", ";
            }
            if (output.substr(output.length-2, 1) == ",")
                output = output.slice(0, -2);
            output += "\n\n Servers: ";
            for(i in response.servers){
                output += response.servers[i] + ", ";
            }
            if (output.substr(output.length-2, 1) == ",")
                output = output.slice(0, -2);
            return output;

        case "status":
            switch(response.type){
                case "vserver":
                    var output =
                    "vServer"
                    + "\n\nName: " + response.name
                    + "\n\nIP: " + response.ip
                    + "\n\nState: " + response.state
                    + "\n\nEffective State: " + response.effstate
                    + "\n\nActive Services: " + response.activeservices + "/" + response.totalservices;
                    return output;

                case "servicegroup":
                    var output =
                    "Service Group"
                    + "\n\nName: " + response.name
                    + "\n\nConnections: " + response.connections
                    + "\n\nState: " + response.state;
                    return output;

                case "service":
                    var output =
                    "Service"
                    + "\n\nName: " + response.name
                    + "\n\nServer Name: " + response.servername
                    + "\n\nIP: " + response.ip
                    + "\n\nPort: " + response.port
                    + "\n\nState: " + response.state
                    + "\n\nConnections: " + response.connections;
                    return output;

                case "server":
                    var output =
                    "Server"
                    + "\n\nName: " + response.name
                    + "\n\nIP: " + response.ip
                    + "\n\nState: " + response.state;
                    return output;

                default: 
                return "Parsing Error";
            }

        case "enable":
            return "OK: " + msg.target + " enabled"

        case "disable":
            return "OK: " + msg.target + " disabled"

        case "disablenow":
            return "OK: " + msg.target + " immediately disabled"

        default:
            return "Parsing Error";
    }
}