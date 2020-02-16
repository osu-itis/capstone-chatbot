module.exports = {
    apps: [{
        name: 'relay',
        script: './relay.js'
    }],
    deploy: {
        production: {
            user: 'ec2-user',
            host: 'ec2-44-231-233-145.us-west-2.compute.amazonaws.com',
            key: '/home/ec2-user/.ssh/chatbot.pem',
            ref: 'origin/master',
            repo: 'git@github.com:osu-itis/capstone-chatbot.git',
            path: '/home/ec2-user/repo/',
            'post-deploy': 'cd ./relay && npm install && pm2 startOrRestart ecosystem.config.js'
        }
    }
}