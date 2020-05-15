const nitroUtil = require('./nitro_util');
const NitroError = require('./nitro_error');

module.exports = (baseURL, token) => {
    return {
        //Relay must use try-catch blocks to catch errors (as NitroError objects), 
        //Which are then passed with next(NitroError) to our error case within the relay
        //Each function here matches a route within the relay

        //This passes through a couple levels: nitroUtil.js -> nitro_list.js
        listVServers: async () => {
            var results = await nitroUtil.vServerListAllNames(baseURL, token);
            return results;
        },

        //This passes through to nitroUtil -> nitro_list_all.js
        listAllResources: async() => {
            var results = await nitroUtil.resourcesListAll(baseURL, token);
            return results;
        },

        //Uses the find resource function, then calls a different internal function based on the type of resource
        //If the resource name isn't matched, an error is thrown and the error route will grab it
        //If the resource is a server (which cannot have bound resources), then the nitro error is generated and throw here
        //  Which is then grabbed by the error route
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
        //As with the previous function, the resource is searched for (if not found an error is thrown)
        //  If successful, a different internal function is called based on the resource type.
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
        //As with the previous function, the resource is searched for (if not found an error is thrown)
        //  If successful, a different internal function is called based on the resource type.
        enableResourceByName: async (resource) => {
            search = await nitroUtil.findResource(baseURL, token, resource);
            switch(search.type){
                case "vserver":
                    var results = await nitroUtil.vServerEnable(baseURL, token, resource);
                    return results;
                case "servicegroup":
                    var results = await nitroUtil.serviceGroupEnable(baseURL, token, resource);
                    return results;
                case "service":
                    var results = await nitroUtil.serviceEnable(baseURL, token, resource);
                    return results;
                case "server":
                    var results = await nitroUtil.serverEnable(baseURL, token, resource);
                    return results;
            }
        },
        //As with the previous function, the resource is searched for (if not found an error is thrown)
        //  If successful, a different internal function is called based on the resource type.
        //  This will pass a delay to function if it can accept one
        disableResourceByName: async (resource, delay, graceful) => {
            search = await nitroUtil.findResource(baseURL, token, resource);
            switch(search.type){
                case "vserver":
                    var results = await nitroUtil.vServerDisable(baseURL, token, resource);
                    return results;
                case "servicegroup":
                    var results = await nitroUtil.serviceGroupDisable(baseURL, token, resource, delay, graceful);
                    return results;
                case "service":
                    var results = await nitroUtil.serviceDisable(baseURL, token, resource, delay, graceful);
                    return results;
                case "server":
                    var results = await nitroUtil.serverDisable(baseURL, token, resource, delay, graceful);
                    return results;
            }
        }
    }
}