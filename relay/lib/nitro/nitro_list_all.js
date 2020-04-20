const nitroList = require('./nitro_list');

//This function runs all the list commands, and returns them
module.exports = async (baseURL, token) => {
    vs = await nitroList.vServerListAllNames(baseURL, token);
    sg = await nitroList.serviceGroupListAllNames(baseURL, token);
    svc = await nitroList.serviceListAllNames(baseURL, token);
    srv = await nitroList.serverListAllNames(baseURL, token);
    let output = {
        "vservers": [],
        "servicegroups": [],
        "services": [],
        "servers": []
    };
    for (i in vs.vserver){
        output.vservers.push(vs.vserver[i].name);
    }
    for (i in sg.servicegroup){
        output.servicegroups.push(sg.servicegroup[i].name);
    }
    for (i in svc.service){
        output.services.push(svc.service[i].name);
    }
    for (i in srv.server){
        output.servers.push(srv.server[i].name);
    }
    return output;
};