var get_user = require('../features/lib/get_user')

describe("get_user", function() {
    it("returns a name user id when used locally", function() {
        //msg reflects the organization of the message object in BotKit and the relevant fields
        var msg = {
            incoming_message :{
                from: {
                    "name":"Test User",
                    "id":"1235678-1234-1234-1234-1234567890ab"
                }
            }
        };
        var user = get_user(msg);
        expect(user.name).toBe("Test User");
        expect(user.id).toBe("1235678-1234-1234-1234-1234567890ab");
    });
    it("returns a name user id when used remotely (through Bot Framework)", function() {
        //msg reflects the organization of the message object in BotKit and the relevant fields
        //this extra field is only present when used remotely in a production environment
        var msg = {
            incoming_message: {
                from: {
                    "name":"Test User",
                    "id":"1235678-1234-1234-1234-1234567890ab",
                    "aadObjectId":"87654321-4321-4321-ba0987654321"
                }
            }
        };
        var user = get_user(msg);
        expect(user.name).toBe("Test User");
        expect(user.id).toBe("87654321-4321-4321-ba0987654321");
    });
});