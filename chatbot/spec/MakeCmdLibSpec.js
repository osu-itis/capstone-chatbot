const cmd_lib = require('../features/lib/cmd/cmd_lib');

//most functions in this library throw strings when the param is invalid
//most tests center around this functionality, if it's good it won't throw
describe("clean", function() {
    it("throws if given an object", function() {
        expect(() => {
            cmd_lib.clean({"property":"value"})
        }).toThrow();
    });
    it("throws if given a number", function() {
        expect(() => {
            cmd_lib.clean(6)
        }).toThrow();
    });
    it("parses a valid input", function() {
        expect(cmd_lib.clean("listbound    web-vs\n\n")).toEqual(["listbound", "web-vs"]);
    });
});

//this function takes 3 param, the actual value, the min and the max (min and max in any order)
//it throws if outside, equal is okay
describe("test_term_count", function() {
    it("if param is in range", function() {
        expect(() => {
            cmd_lib.test_term_count(3,2,5)
        }).not.toThrow();
    });
    it("if param is in (backwards) range", function() {
        expect(() => {
            cmd_lib.test_term_count(3,5,2)
        }).not.toThrow();
    });
    it("if param is below range", function() {
        expect(() => {
            cmd_lib.test_term_count(1,2,5)
        }).toThrow();
    });
    it("if param is below (backwards) range", function() {
        expect(() => {
            cmd_lib.test_term_count(1,5,2)
        }).toThrow();
    });
    it("if param is above range", function() {
        expect(() => {
            cmd_lib.test_term_count(6,2,5)
        }).toThrow();
    });
    it("if param is above (backwards) range", function() {
        expect(() => {
            cmd_lib.test_term_count(6,5,2)
        }).toThrow();
    });
    it("if param is in small range", function() {
        expect(() => {
            cmd_lib.test_term_count(3,3,3)
        }).not.toThrow();
    });
});

//test target param looks for bad characters
//Netscaler only allows these characters: 0-9a-zA-Z -_#.:@=
//Otherwise function will throw
describe("test_target_param", function() {
    it("accepts all good characters", function() {
        expect(() => {
            cmd_lib.test_target_param("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321 -_#.:@=")
        }).not.toThrow();
    });
    it("throws with a single bad character", function() {
        expect(() => {
            cmd_lib.test_target_param("(")
        }).toThrow();
    });
    it("throws with a many bad characters", function() {
        expect(() => {
            cmd_lib.test_target_param("!$%^&*()+{}[]|\\'\"\n")
        }).toThrow();
    });
    it("throws with a single bad character among good characters", function() {
        expect(() => {
            cmd_lib.test_target_param("aasljdn%nljc0830292")
        }).toThrow();
    });
});

//test_command_param throws if it's input is not a valid command
//valid commands: list, listall, listbound, status, enable, disable, disablenow
describe("test_command_param", function() {
    it("accepts list", function() {
        expect(() => {
            cmd_lib.test_command_param("list")
        }).not.toThrow();
    });
    it("accepts listall", function() {
        expect(() => {
            cmd_lib.test_command_param("listall")
        }).not.toThrow();
    });
    it("accepts listall", function() {
        expect(() => {
            cmd_lib.test_command_param("listall")
        }).not.toThrow();
    });
    it("accepts listbound", function() {
        expect(() => {
            cmd_lib.test_command_param("listbound")
        }).not.toThrow();
    });
    it("accepts status", function() {
        expect(() => {
            cmd_lib.test_command_param("status")
        }).not.toThrow();
    });
    it("accepts enable", function() {
        expect(() => {
            cmd_lib.test_command_param("enable")
        }).not.toThrow();
    });
    it("accepts disable", function() {
        expect(() => {
            cmd_lib.test_command_param("disable")
        }).not.toThrow();
    });
    it("accepts disablenow", function() {
        expect(() => {
            cmd_lib.test_command_param("disablenow")
        }).not.toThrow();
    });
    it("accepts help", function() {
        expect(() => {
            cmd_lib.test_command_param("help")
        }).not.toThrow();
    });
    it("accepts request-auth", function() {
        expect(() => {
            cmd_lib.test_command_param("request-auth")
        }).not.toThrow();
    });
    it("fails with any other input", function() {
        expect(() => {
            cmd_lib.test_command_param("dsknyytokjb")
        }).toThrow();
    });
    it("fails with double input", function() {
        expect(() => {
            cmd_lib.test_command_param("helphelp")
        }).toThrow();
    });
});

//test_int_param
describe("test_int_param", function() {
    it("throws at a non-int string", function() {
        expect(() => {
            cmd_lib.test_int_param("hello")
        }).toThrow();
    });
    it("throws at a decimal number", function() {
        expect(() => {
            cmd_lib.test_int_param(1.7)
        }).toThrow();
    });
    it("returns an int when it passes", function() {
        expect(cmd_lib.test_int_param("50")).toBe(50);
    });
});