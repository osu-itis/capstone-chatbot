//  __   __  ___        ___
// |__) /  \  |  |__/ |  |  
// |__) \__/  |  |  \ |  |  

// This is the main file for the nitro-chatbot bot.

// Import Botkit's core features
const { Botkit } = require('botkit');
const { BotkitCMSHelper } = require('botkit-plugin-cms');

// Import a platform-specific adapter for botframework.

const { MongoDbStorage } = require('botbuilder-storage-mongodb');

// To read credentials from file
const fs = require('fs');

// Load process.env values from .env file
require('dotenv').config();

let storage = null;
if (process.env.MONGO_URI) {
    storage = mongoStorage = new MongoDbStorage({
        url : process.env.MONGO_URI,
    });
}

//Reading app id and password from file
let app_id, app_pw, contents;
try {
    contents = fs.readFileSync('.app_creds', 'utf8');
    lines = contents.split('\n');
    //app_id = lines[0];
    //app_pw = lines[1];
} catch (e) {
    console.log("Unable to read app creds from file: .app_creds");
    console.log(e);
}

//Start the controller using credentials from MS, and standard route
const controller = new Botkit({
    webhook_uri: '/api/messages',

    adapterConfig: {
        appId: app_id,
        appPassword: app_pw,
    },

    storage
});

if (process.env.CMS_URI) {
    controller.usePlugin(new BotkitCMSHelper({
        uri: process.env.CMS_URI,
        token: process.env.CMS_TOKEN,
    }));
}

// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(() => {

    // load traditional developer-created local custom feature modules
    controller.loadModules(__dirname + '/features');

    /* catch-all that uses the CMS to trigger dialogs */
    if (controller.plugins.cms) {
        controller.on('message,direct_message', async (bot, message) => {
            let results = false;
            results = await controller.plugins.cms.testTrigger(bot, message);

            if (results !== false) {
                // do not continue middleware!
                return false;
            }
        });
    }
});

controller.webserver.get('/', (req, res) => {
    res.send(`This app is running Botkit ${ controller.version }.`);
});





