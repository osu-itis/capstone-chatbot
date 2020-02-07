module.exports = {
    apps: [{
        name: 'chatbot',
        script: './bot.js'
    }],
    deploy: {
        production: {
            user: 'ec2-user',
            host: 'ec2-44-230-101-115.us-west-2.compute.amazonaws.com',
            key: '~/.ssh/chatbot.pem',
            ref: 'origin/master',
            repo: 'git@github.com:osu-itis/capstone-chatbot.git',
            path: '/home/ec2-user/repo/',
            'post-deploy': 'cd ./chatbot &&npm install && pm2 startOrRestart ecosystem.config.js'
        }
    }

}