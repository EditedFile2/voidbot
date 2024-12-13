const Discord = require('discord.js');

module.exports = {

    custom: function(title = null, description = null, footer = null, color = null) {

        var embed = new Discord.EmbedBuilder()

        if(title !== null) embed.setTitle(title)
        if(description !== null) embed.setDescription(description)
        if(footer !== null) embed.setFooter(footer)
        if(color !== null) embed.setColor(color)

        return embed

    },

};