//Utility functions for nitro.js and nitro_list.js

module.exports = {
    //Flattens a resources object to put all resources on same level
    //with a type property to differentiate each
    flattenResAll: (resources) => {
        //console.log(resources);
        output = [];
        for(i in resources.vservers){
            output.push({
                "name": resources.vservers[i],
                "type": "vserver"
            });
        }
        for(i in resources.servicegroups){
            output.push({
                "name": resources.servicegroups[i],
                "type": "servicegroup"
            });
        }
        for(i in resources.services){
            output.push({
                "name": resources.services[i],
                "type": "service"
            });
        }
        for(i in resources.servers){
            output.push({
                "name": resources.servers[i],
                "type": "server"
            });
        }
        return output;
    }
}