var pp = require('../features/util/pretty_print_json');

describe("pretty_print_json", function() {
    it("Outputs in the specified format when no data property is present", function() {
        //represents what the relay might return for enable, disable or disablenow
        var http_res_body_data = {
            "status": "200",
            "statustext": "OK"
        };
        var teams_output = pp(http_res_body_data);
        expect(teams_output).toBe("\n\n**status:** 200\n\n**statustext:** OK\n\n");
    });

    it("outputs from the data property when present", function() {
        //represents what the relay might return for list, listall or status
        var http_res_body_data = {
            "status": "200",
            "statustext": "OK",
            "data": {
                "vservers": [
                    "web-vs"
                ]
            }
        };
        var teams_output = pp(http_res_body_data);
        expect(teams_output).toBe("\n\n**vservers:** \n\nweb-vs\n\n\n\n");
    });
});