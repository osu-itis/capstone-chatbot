//Pretty print the JSON results from the relay.
//To format for MSTeams:
//**This is Bold**
//_This is Italic_
//- This\r- Is\r- An\r- Unordered\r- List
//1. This\r2. Is\r3. An\r4. Ordered\r5. List
//[This is a link](https://google.com/)
///tThis is preformatted text

module.exports = (obj) => {
    if(obj.hasOwnProperty("data")) obj = obj.data;
    //Stringify object using \n at the whitespace
    result = JSON.stringify(obj, null, "\n");
    //All chained \n are replaced with: \n\n to create a newline within MSTeams
    result = result.replace(/\n+/g, "\n\n");
    //All JSON formatting symbols are stripped
    result = result.replace(/[,\[\]\{\}\"]/g, "");
    //Each newline with a string then a colon is made bold. This captures property names.
    result = result.replace(/\n([a-zA-Z\-]+):/g, "\n**$1:**");
    return result;
}