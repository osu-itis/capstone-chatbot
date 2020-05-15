# Nitro Chatbot (Capstone Group CS63)

## Progress Post-Code Review

### Fixed Bugs
During the live demo of the code review, I spotted 2 small production errors that have been resolved. Please view the links for more description of the issue and it's resolution.
- Angle brackets not showing on the usage message command: `help`
  - This has now been resolved with [Pull Request #18](https://github.com/osu-itis/capstone-chatbot/pull/18)
- The Linux client was unable to pass the schema tests on the relay.
  - This has now been resolved with [Pull Request #17](https://github.com/osu-itis/capstone-chatbot/pull/17)

### Feedback Forms
As a team, we recieved a total of 3 feedback forms. The feedback was overwhelmingly positive, and contained very little correction or potential improvements. Here I will discuss the feedback we recieved so as to assure the grader that we've carefully considered the feedback.

### Fuzz Testing?
First, 2 people mentioned potentially using fuzz testing, to presumably test routes and other forms of input. As we discussed during our code review, we didn't think it was feasible to implement this in a way that would provide meaningful information at this point. But, allow me to explain the project and our thought process here.

Essentially, in production, the chatbot will only recieve input from Microsoft, as it handles the messages sent from users. The chatbot itself is registered with Microsoft and uses an application ID and password given by Microsoft. The chatbot component of the project is built with BotKit. Tests down this path would either be testing Microsoft, or the framework, BotKit, itself (owned by Microsoft). However, user input itself is thoroughly tested and carefully sanitized.

The second target of additional testing could be the Relay itself. However, our system employs a shared symmetric key, and verifies the key with each request by use of a 6-digit TOTP password that rolls over every 30 seconds. Every request that doesn't match a current key is discarded.

Additionally all requests that do reach the relay must exactly match the json schemas designed for each request. This includes careful regex matching. UserIDs are then matched against a database, and credentials for only that user are retrieved and never stored within the relay.

With this system, we find that while additional testing may be possible (essentially customized end-to-end testing), it's simply not worth the time it would take for us to implement.

### More Comments?
The only other suggestion that we recieved was to further comment the code as it relates to authentication and other external requests. This is something that will be implemented with the next commit.

### Requirements Met
All feedback we received during the code review agree that our project meets the requirements given in the updated version of the requirements document.

### Deployment
Beyond this, we know that our client would like to see at least a Cloudformation template that accurately describes our AWS configuration. This will be the final piece of our project to be submitted to this repository.

## May 1st: Note to Code Review Teams
Running this project locally without major edits to the code will be impossible. Portions of this code require an AWS with specific resources configured in a specific way. During code review I will be sharing my screen and allow individuals to test inputs if they would like to test functionality. This project is currently running and operational within Microsoft Teams (which can also be demonstrated and tested during the review).

## Project Overview
This project is a chatbot for Microsoft Teams that allows authorized users to quickly query a NetScaler loadbalancer to view the status and enable/disable various resources.
Contained within are 2 Node.js projects that are meant to be deployed seperately and interact with each other. Additionally there are 2 more folders, one for documentation and one for file pertaining to deployment.

### Chatbot
The first project is the chatbot (contained within /chatbot). The chatbot uses BotKit to interact with Microsoft's Bot Framework. For the chatbot to operate, it must be deployed and accessed with an https address (For deployment, we use a purchased domain: nitrochatbot.com). Additionally, the chatbot must be registered as a Microsoft application to obtain a valid ID and Secret Key to be accessible through Microsoft Teams. Finally, accessing the application requires an application manifest file (within the /deployment folder).

### Relay
The second project is the relay (contained within /relay). The relay acts as a web server (running with Express), accepting messages only from the chatbot. Messages it recieves are parsed and formulated into requests to the NetScaler (via it's REST API, NITRO). The relay then passes responses to the chatbot so it can reply to the user.

### Deployment
This folder will contain relevant files pertaining to deployment of this project. Additionally, this folder will contain the application manifest file that can be used to install NitroChatbot as an application within Microsoft Teams.

### Documentation
All capstone related documention for this project is held within /documentation. This includes an updated (April 27, 2020) version of the requirements document (`cs63_requirementsdocument.pdf`). Latex files are also present, including a Makefile intended for use on Oregon State's "Flip" server.

## Running the Project
**Note:** These instructions are intended for use on Linux (as this project is untested on Windows). Development was completed entirely on a VM running Lubuntu 19.04, however it should be easy to adapt to a Windows environment if needed.

**Note 2:** The following instructions require the use of an AWS account, some of these things may result in charges.

### Prerequisites
The following software needs to be installed locally to run the project:
- Node v13
- Bot Framework Emulator

Now clone to repository to a local folder. A few files will also need to be added to the project:
```
/chatbot/.env
/chatbot/.app_creds
/relay/.env
```

Also this file needs to be added to the system:
```
~/.aws/credentials
```

In /chatbot/.env 2 lines are required:
```
RELAY_URL=
TOTP_KEY=
```

RELAY_URL must be equal to the address for the relay when it's running. In the case of running locally, this will be equal to `http://127.0.0.1:3001`
TOTP_KEY must be a base32 key, probably of length 16 (other lengths will work however). Base32 is uppercase letters A-Z and digits 2-7. This value must be matched within /relay/.env

In .app_creds there must be 2 lines, the first line is the Microsoft App ID, and the second line is the Microsoft App Password.
In the case of running locally, these lines may be empty, but they must be there (the bot does not need to authenticate with Microsoft correctly to run locally)

In /relay/.env :
```
PORT=
TOTP_KEY=
```

TOTP_KEY must be set to the same value as it set in /chatbot/.env (base32)
PORT is optional (defaulting to 3001 when not present), but I recommend still including this line so that we are explicit.

Finally, one more file is required. Within your home directory (~), create a folder .aws, and within that folder create a file called credentials.

In the credentials file create this structure and fill in details for an AWS user:
```
[default]
aws_access_key_id = 
aws_secret_access_key =
```

The AWS user above must have a policy with this fields attached:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "secretsmanager:GetResourcePolicy",
                "secretsmanager:GetSecretValue",
                "secretsmanager:DescribeSecret",
                "secretsmanager:ListSecretVersionIds"
            ],
            "Resource": [
                "*"
            ]
        },
	      {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "logs:DescribeLogStreams"
            ],
            "Resource": [
                "arn:aws:logs:*:*:*"
            ]
        }
    ]
}
```

Next we must create an AWS CloudWatch Log Group and 2 Streams:
In CloudWatch, go to Logs->Log groups.
Click Create log group and set it's name to NitroChatbot
Inside the new log group, create 2 log streams: UserLogs and RequestedAuths

Next go to SecretsManager within AWS, and create a new custom Secret with the following fields:
```
{
  "url": "https://netscaleraddress.com",
  "username": "nsroot",
  "password": "nsroot"
}
```

Set url to the address of your netscaler hardware/instance from the relay. In the case of running locally or from AWS, this will be some public address
username and password should be set to your credentials to access the NetScaler, nsroot/nsroot are default netscaler credentials.

The name of the secret will be your Micrsoft global ID in this format (all lowercase hexidecimal): 
`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

You may choose to run a remote instance of Citrix ADC (this is a free AMI to use) within AWS to perform these operations against. In this case, the default username is nsroot, and the default password is the instance id (viewable within the EC2 console).
Or you may run a version of the NetScaler software locally in a VM. In this case, the default credentials are nsroot/nsroot.

### Running the Projects
From the /chatbot directory, run `npm install` to install project dependencies, and then `npm start` to start the project.

In a different terminal, from the /relay directory, again run `npm install` to install the seperate dependencies, and then `npm start` to run the project.

Now open Bot Framework Emulator, and select "Open Bot" and point it to the running chatbot application: `127.0.0.1:3000/api/messages`. Additionally, you may want to change your user id to match the name of your secret in SecretsManager. This is something that can be done when running locally, but not in a production environment.

### Running the Tests
Within each of the 2 projects is the ability to run test suites. For our development pipeline, we have a seperate Jenkins instance provisioned within AWS that automatically runs all our tests for each branch on each commit. Viewing the commit history will show small icons next to the commit signifying if the commit passes all tests.
To run these tests locally you just need to navigate to the project folder and run the command `npm test`. The result of the tests will be output to the command line.

## Deployment Details
For deploying the project, a cloudformation template will be created that outlines the required resources and their properties within AWS. The goal is to have this template to be able to recreate the entire AWS deployment. As of yet, this portion of the project is still in the works and is not yet in the repository.

## Final Note
Thanks for visiting the repository and making it this far into the document. If you have an questions, comments, or concerns feel free to reach out here: `barnesj@oregonstate.edu`
