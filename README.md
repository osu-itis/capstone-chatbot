# Nitro Chatbot (Capstone Group CS63)

## Project Overview
This project is a chatbot for Microsoft Teams that allows authorized users to quickly query a NetScaler loadbalancer to view the status and enable/disable various resources.
Contained within are 2 Node.js projects that are meant to be deployed seperately and interact with each other. Additionally there are 2 more folders, one for documentation and one for file pertaining to deployment.

### Chatbot
The first project is the chatbot (contained within /chatbot). The chatbot uses BotKit to interact with Microsoft's Bot Framework. For the chatbot to operate, it must be deployed and accessed with an https address (For deployment, we use a purchased domain: nitrochatbot.com). Additionally, the chatbot must be registered as a Microsoft application to obtain a valid ID and Secret Key to be accessible through Microsoft Teams. Finally, accessing the application requires an application manifest file (within the /deployment folder).

### Relay
The second project is the relay (contained within /relay). The relay acts as a web server (running with Express), accepting messages only from the chatbot. Messages it recieves are parsed and formulated into requests to the NetScaler (via it's REST API, NITRO). The relay then passes responses to the chatbot so it can reply to the user.

### Deployment
This folder contains relevant files pertaining to deployment of this project. Additionally, this folder will contain the application manifest file that can be used to install NitroChatbot as an application within Microsoft Teams.

### Documentation
All capstone related documention for this project is held within /documentation. This includes an updated (April 27, 2020) version of the requirements document (`cs63_requirementsdocument.pdf`). Latex files are also present, including a Makefile intended for use on Oregon State's "Flip" server.

### Further Information
In addition to this readme, there are 3 more files within this directory.

- CODE_REVIEW_RESPONSE: This file contains our teams response and project changes from between the Code Review and Code Freeze.
- DEPLOYMENT: This file contains details about deploying this project on AWS, including which information you'll need to gather and steps to take before creating the stack from the included template.
- LOCAL_USAGE: This file contains information about running the project locally. This was included for the code review, but may be helpful to understanding the project further.

## Final Note
Thanks for visiting the repository and making it this far into the document. If you have an questions, comments, or concerns feel free to reach out here: `barnesj@oregonstate.edu`
