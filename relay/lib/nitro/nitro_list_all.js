const nitroList = require('./nitro_list');

//This function runs all the list commands, and returns them

module.exports = async (baseURL, token, flatten) => {
    //compile each list of resources
    //If any request results in an error, an instance of NitroError will be thrown and caught above this
    //All requests must succeed for this function to work
    vs = await nitroList.vServerListAllNames(baseURL, token);
    sg = await nitroList.serviceGroupListAllNames(baseURL, token);
    svc = await nitroList.serviceListAllNames(baseURL, token);
    srv = await nitroList.serverListAllNames(baseURL, token);
    let resources = {
        "vservers": [],
        "servicegroups": [],
        "services": [],
        "servers": []
    };
    for (i in vs.vservers){
        resources.vservers.push(vs.vservers[i].name);
    }
    for (i in sg.servicegroups){
        resources.servicegroups.push(sg.servicegroups[i].name);
    }
    for (i in svc.services){
        resources.services.push(svc.services[i].name);
    }
    for (i in srv.servers){
        resources.servers.push(srv.servers[i].name);
    }
    if(flatten) {
        flatRes = [];
        for(i in resources.vservers){
            flatRes.push({
                "name": resources.vservers[i],
                "type": "vserver"
            });
        }
        for(i in resources.servicegroups){
            flatRes.push({
                "name": resources.servicegroups[i],
                "type": "servicegroup"
            });
        }
        for(i in resources.services){
            flatRes.push({
                "name": resources.services[i],
                "type": "service"
            });
        }
        for(i in resources.servers){
            flatRes.push({
                "name": resources.servers[i],
                "type": "server"
            });
        }
        return flatRes;
    } else {
        return resources;
    }
    
};