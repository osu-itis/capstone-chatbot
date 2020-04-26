const nitroUtil = require('./nitro_util');
const NitroError = require('./nitro_error');

module.exports = (baseURL, token) => {
    return {
        //Relay must use try-catch blocks to catch errors (as NitroError objects), 
        //Which are then passed with next(NitroError) to our error case within the relay
        //Each function here matches a route within the relay
        listVServers: async () => {
            results = await nitroUtil.vServerListAllNames(baseURL, token);
            return results;
        },
        listAllResources: async() => {
            results = await nitroUtil.resourcesListAll(baseURL, token);
            return results;
        },
        listBoundResourcesByName: async (resource) => {
            var search = await nitroUtil.findResource(baseURL, token, resource);
            switch(search.type) {
                case "vserver":
                    var results = await nitroUtil.listVServerBoundEntities(baseURL, token, resource);
                    return results;
                case "servicegroup":
                    var results = await nitroUtil.listServiceGroupBoundEntities(baseURL, token, resource);
                    return results;
                case "service":
                    var results = await nitroUtil.listServiceBoundEntity(baseURL, token, resource);
                    return results;
                case "server":
                    //User requested bound entities of a server, cannot complete the request
                    throw new NitroError({
                        response: {
                            status: 400,
                            statustext: "Servers cannot have entities bound to them"
                        }
                    });
            }
        },
        getResourceStatusByName: async (resource) => {
            var search = await nitroUtil.findResource(baseURL, token, resource);
            switch(search.type) {
                case "vserver":
                    var results = await nitroUtil.vServerListStats(baseURL, token, resource);
                    return results;
                case "servicegroup":
                    var results = await nitroUtil.serviceGroupListStats(baseURL, token, resource);
                    return results;
                case "service":
                    var results = await nitroUtil.serviceListStats(baseURL, token, resource);
                    return results;
                case "server":
                    var results = await nitroUtil.serverListStats(baseURL, token, resource);
                    return results;
                }
        },
        enableResourceByName: async (resource) => {
            search = await nitroUtil.findResource(baseURL, token, resource);
            switch(search.type){
                case "vserver":
                    result = await nitroUtil.vServerEnable(baseURL, token, resource);
                    return results;
                case "servicegroup":
                    result = await nitroUtil.serviceGroupEnable(baseURL, token, resource);
                    return results;
                case "service":
                    result = await nitroUtil.serviceEnable(baseURL, token, resource);
                    return results;
                case "server":
                    result = await nitroUtil.serverEnable(baseURL, token, resource);
                    return results;
            }
        },
        disableResourceByName: async (resource, delay, graceful) => {
            search = await nitro.findResource(baseURL, token, resource);
            switch(search.type){
                case "vserver":
                    result = await nitroUtil.vServerDisable(baseURL, token, resource);
                    return results;
                case "servicegroup":
                    result = await nitroUtil.serviceGroupDisable(baseURL, token, resource, delay, graceful);
                    return results;
                case "service":
                    result = await nitroUtil.serviceDisable(baseURL, token, resource, delay, graceful);
                    return results;
                case "server":
                    result = await nitroUtil.serverDisable(baseURL, token, resource, delay, graceful);
                    return results;
            }
        }
    }
}