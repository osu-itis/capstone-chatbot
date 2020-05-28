## AWS Deployment

To deploy this project within AWS, a Cloudformation template deployment/NitroChatbot.json accurately describes all the resources needed to deploy both instances to AWS.

### Prerequisites

- Existing Key-Pair within AWS to assign to both instances (the template will prompt for this)
- The bot needs to be registered with Microsoft's Bot Framework [here](https://dev.botframework.com/bots/new)
- You'll need both the App ID and an access key (which needs to be generated separately) when creating the stack from the template.
- URL for the Relay (this is given to the chatbot instance so that is can communicate with the relay using https).
- Full ARN for a pre-generated SSL certificate. This is used by both application load balancers.
- A TOTP Key. This is Base32 (A-Z,2-7) and must be 32 characters long. You can run the file totpgenks.js with node to generate a valid key.

### Creating the Stack

Use Cloudformation with the NitroChatbot.json for the template. Enter all the information gathered during the prerequites into the parameters. On average it took about 5-7 minutes to finish creating the stack.

Once the stack is created you'll be able to see both public DNS addresses within the Outputs. After the instances have finished initializing, you'll be able to verify their operation by visiting those addresses (make sure you prefix them with `https://`).

Note: You'll have to click through a certificate warning, since your browser will be recieving a certificate that doesn't match the address you browsed to.

The chatbot instance will give you a plain page that states which version of Botkit it's running. And the Relay instance will give you an error about missing fields in your request. This is a good sign.

The next step is to use the outputs you were given as ALIAS A Records for your hosted zone in Route 53.

Finally, from Microsoft Teams, install the application using the NitroChatbot.zip file.

Note: the manifest file contained within will need to be updated to match the URL of the Chatbot and it's application id.

### Adding Users

To add an allowed user for Nitro Chatbot you'll need to create a new secret in SecretsManager.

The secret name needs to match their unique ID (users who use the command "request-auth" with the chatbot will have this value logged in the "RequestedAuths" log stream).
The contents of the secret must be:
Secret Key | Secret Value
|:--------:|:------------:|
url | https://<i></i>nitrourl.com/
username | <their_username>
password | <their_password>

### Final Notes

I attempted to create a Macro to generate a TotpKey on stack creation, but could not get it to work (wasn't able to reference it from another template). However, I did include the work I did in the file NitroChatbotGenKey.json. This should be fixable with a little work.

One alternative to including a macro, would be to have the Lambda function run seperately and store the key for the instances to read seperately. This could be used to periodically reroll the key for additional security. Unfortunately, we weren't able to implement this within our limited timeframe.

If there is any questions about the project, feel free to reach out to me here: `barnesj@oregonstate.edu`. Thanks!
