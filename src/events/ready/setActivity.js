
const { ActivityType } = require('discord.js')
const config = require('../../../config.json')

module.exports = (client) => {


client.user.setPresence({ 
    activities: [{ 
        name: "with void.ai",
        type: ActivityType.Playing,  
    }], 
    status: config.presence.status 
});


}
