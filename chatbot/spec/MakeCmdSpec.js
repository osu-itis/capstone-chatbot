const make_cmd = require('../features/lib/cmd/make_cmd');
//The Make_Cmd library makes use of the cmd_lib functions.
//This sets the individual requirements for each command input.
//Bad inputs will result in strings being thrown.

//We can safely assume the first term (the command), will be correct
// due to the regex on the botkit event

describe("list", function() {
    it("throws if given too many parameters", function() {
        expect(() => {
            make_cmd.list("LIST   param")
        }).toThrow();
    });
    it("parses to an object", function() {
        expect(make_cmd.list("LIST")).toEqual({"command":"list"});
    });
});

describe("listall", function() {
    it("throws if given too many parameters", function() {
        expect(() => {
            make_cmd.listall("LiStAll toomany\n")
        }).toThrow();
    });
    it("parses to an object", function() {
        expect(make_cmd.listall("LISTall")).toEqual({"command":"listall"});
    });
});

describe("listbound", function() {
    it("throws if given too few parameters", function() {
        expect(() => {
            make_cmd.listbound("LISTbouNd")
        }).toThrow();
    });
    it("throws if given too many parameters", function() {
        expect(() => {
            make_cmd.listbound("LiSTbound one two three")
        }).toThrow();
    });
    it("throws if param cannot be resource name", function() {
        expect(() => {
            make_cmd.listbound("listbound !@#$%^&*")
        }).toThrow();
    });
    it("parses to an object", function() {
        expect(make_cmd.listbound("LISTBOUND resource")).toEqual({"command":"listbound","target":"resource"});
    });
});

describe("status", function() {
    it("throws if given too few parameters", function() {
        expect(() => {
            make_cmd.status("statUs")
        }).toThrow();
    });
    it("throws if given too many parameters", function() {
        expect(() => {
            make_cmd.status("status one two three")
        }).toThrow();
    });
    it("throws if param cannot be resource name", function() {
        expect(() => {
            make_cmd.status("status !@#$%^&*")
        }).toThrow();
    });
    it("parses to an object", function() {
        expect(make_cmd.status("status resource")).toEqual({"command":"status","target":"resource"});
    });
});

describe("enable", function() {
    it("throws if given too few parameters", function() {
        expect(() => {
            make_cmd.enable("enable")
        }).toThrow();
    });
    it("throws if given too many parameters", function() {
        expect(() => {
            make_cmd.enable("enable one two three")
        }).toThrow();
    });
    it("throws if param cannot be resource name", function() {
        expect(() => {
            make_cmd.enable("enable !@#$%^&*")
        }).toThrow();
    });
    it("parses to an object", function() {
        expect(make_cmd.enable("enable resource")).toEqual({"command":"enable","target":"resource"});
    });
});

describe("disable", function() {
    it("throws if given too few parameters", function() {
        expect(() => {
            make_cmd.disable("disable")
        }).toThrow();
    });
    it("throws if given too many parameters", function() {
        expect(() => {
            make_cmd.disable("disable one two three")
        }).toThrow();
    });
    it("throws if param cannot be resource name", function() {
        expect(() => {
            make_cmd.disable("disable !@#$%^&*")
        }).toThrow();
    });
    it("throws if second param is not int", function() {
        expect(() => {
            make_cmd.disable("disable resource 12.12")
        }).toThrow();
    });
    it("throws if second param is not int", function() {
        expect(() => {
            make_cmd.disable("disable resource notint")
        }).toThrow();
    });
    it("parses to an object w/o delay", function() {
        expect(make_cmd.disable("disable resource")).toEqual({"command":"disable","target":"resource","delay":0});
    });
    it("parses to an object w/ delay", function() {
        expect(make_cmd.disable("disable resource 1500")).toEqual({"command":"disable","target":"resource","delay":1500});
    });
});

describe("disablenow", function() {
    it("throws if given too few parameters", function() {
        expect(() => {
            make_cmd.disablenow("disablenow")
        }).toThrow();
    });
    it("throws if given too many parameters", function() {
        expect(() => {
            make_cmd.disablenow("disablenow one two three")
        }).toThrow();
    });
    it("throws if param cannot be resource name", function() {
        expect(() => {
            make_cmd.disablenow("disablenow !@#$%^&*")
        }).toThrow();
    });
    it("throws if second param is not int", function() {
        expect(() => {
            make_cmd.disablenow("disablenow resource 12.12")
        }).toThrow();
    });
    it("throws if second param is not int", function() {
        expect(() => {
            make_cmd.disablenow("disablenow resource notint")
        }).toThrow();
    });
    it("parses to an object w/o delay", function() {
        expect(make_cmd.disablenow("disablenow resource")).toEqual({"command":"disablenow","target":"resource","delay":0});
    });
    it("parses to an object w/ delay", function() {
        expect(make_cmd.disablenow("disablenow resource 1500")).toEqual({"command":"disablenow","target":"resource","delay":1500});
    });
});

describe("help", function() {
    it("throws if given too many parameters", function() {
        expect(() => {
            make_cmd.help("help help help")
        }).toThrow();
    });
    it("throws if param isn't another command", function() {
        expect(() => {
            make_cmd.help("help fakecommandname")
        }).toThrow();
    });
    it("parses to an object without param", function() {
        expect(make_cmd.help("help")).toEqual({"command":"help","target":"all"});
    });
    it("parses to an object with param", function() {
        expect(make_cmd.help("help listbound")).toEqual({"command":"help","target":"listbound"});
    });
});

describe("reqauth", function() {
    it("throws if given nonstring", function() {
        expect(() => {
            make_cmd.reqauth({"property":"notastring"})
        }).toThrow();
    });
    it("gives empty target without a message param", function() {
        expect(make_cmd.reqauth("request-auth")).toEqual({"command":"request-auth","target":""});
    });
    it("gives target with full message", function() {
        expect(make_cmd.reqauth("request-auth Let me in!")).toEqual({"command":"request-auth","target":"Let me in!"});
    });
});