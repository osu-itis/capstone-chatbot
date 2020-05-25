## Progress Post-Code Review (Updated May 15th)

### Fixed Bugs
During the live demo of the code review, I spotted 2 small production errors that have been resolved. Please view the links for more description of the issue and it's resolution.
- Angle brackets not showing on the usage message command: `help`
  - This has now been resolved with [Pull Request #18](https://github.com/osu-itis/capstone-chatbot/pull/18).
- The Linux client was unable to pass the schema tests on the relay.
  - This has now been resolved with [Pull Request #17](https://github.com/osu-itis/capstone-chatbot/pull/17).

### Feedback Forms
As a team, we recieved a total of 3 feedback forms. The feedback was overwhelmingly positive, and contained very little correction or potential improvements. Here I will discuss the feedback we recieved so as to assure the grader that we've carefully considered the feedback.

### More Comments?
One suggestion that we recieved was to further comment the code, especially parts dealing with authentication and other external requests. As a result of this feedback I've added (or modified) 84 lines of comments to our code. This can be seen in [Pull Request #19](https://github.com/osu-itis/capstone-chatbot/pull/19).

### Fuzz Testing?
The other only suggestion we recieved was for fuzz testing. This was suggested by 2 people, to presumably, test routes and other forms of input. As we discussed during our code review, we didn't think it was feasible to implement this in a way that would provide meaningful information at this point. But, allow me to explain the project and our thought process here (apologies if the explaination is a bit long-winded).

Essentially, in production, the chatbot will only recieve input from Microsoft, as it handles the messages sent from users. The chatbot itself is registered with Microsoft and uses an application ID and password given by Microsoft. The chatbot component of the project is built with BotKit. Tests down this path would either be testing Microsoft, or the framework, BotKit, itself (owned by Microsoft). However, user input itself is thoroughly tested and carefully sanitized.

The second target of additional testing could be the Relay itself. However, our system employs a shared symmetric key, and verifies the key with each request by use of a 6-digit TOTP password that rolls over every 30 seconds. Every request that doesn't match a current key is discarded.

Additionally all requests that do reach the relay must exactly match the json schemas designed for each request. This includes careful regex matching. UserIDs are then matched against a database, and credentials for only that user are retrieved and never stored within the relay.

With this system, we find that while additional testing may be possible (essentially customized end-to-end testing), it's simply not worth the time it would take for us to implement.

### Requirements Met
All feedback we received during the code review agree that our project meets the requirements given in the updated version of the requirements document.

### Deployment
Although not this is not a strict requirement set forth in the requirements document, we know that our client would like to see a Cloudformation template that accurately describes our AWS configuration. To this end, the final submission to our repository before code freeze is within a new folder "deployment". This contains a json file to be used to deployment the required resources and standup the instances required to use our project. This can be seen in [Pull Request #21](https://github.com/osu-itis/capstone-chatbot/pull/21).

That's it for our code review response. Thanks!

## Note to Code Review Teams (May 1st)
Running this project locally (without any AWS resources) without major edits to the code will be impossible. Portions of this code require an AWS with specific resources configured in a specific way. During code review I will be sharing my screen and allow individuals to test inputs if they would like to test functionality. This project is currently running and operational within Microsoft Teams (which can also be demonstrated and tested during the review).

For information pertaining to running this project locally see file LOCAL_USAGE.md
