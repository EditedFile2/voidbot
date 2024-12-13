const {
    ApplicationCommandOptionType,
    Client,
    Interaction,
    PermissionFlagsBits,
    EmbedBuilder,
} = require('discord.js');

const { stt } = require('../../utils/stt.js');

const fs = require('fs');


const axios = require('axios');

const { shorten } = require('../../utils/shorten.js');
const config = require('../../../config.json');

const logger = require('../../utils/logger.js');
const embeds = require('../../utils/embeds.js');

module.exports = {
    // deleted: true,
    name: 'stt',
    description: 'Convert speech audio to text.',
    integration_types: [0, 1],
    contexts: [0, 1, 2], 
    options: [
    {
        name: 'audio',
        description: 'The audio to be converted into text.',
        required: true,
        type: ApplicationCommandOptionType.Attachment,
    },
    {
        name: "ephemeral",
        description: 'Visible only to you, ensuring the output remains private.',
        required: false,
        type: ApplicationCommandOptionType.Boolean,
    },
    ],
    botPermissions: [
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.AttachFiles,
        PermissionFlagsBits.SendMessagesInThreads,
        PermissionFlagsBits.SendMessages,
    ],
    canExternal: true,

    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */

    
    callback: async(client, interaction) => {

        const attachment = await interaction.options.getAttachment('audio')
        const ephemeral = await interaction.options.getBoolean('ephemeral');


        await interaction.deferReply({ ephemeral: ephemeral == true ? true : false })


        const url = attachment.url;
        const path = `./${Date.now()}_${attachment.name}`;
        const writer = fs.createWriteStream(path);
    
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
        });
    
        response.data.pipe(writer);
    
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });




        try {

            const response = await stt(path)


            const embed = embeds.custom(
                `Speech to text`,
                `${shorten(response, 2048)}`,
                { text: `voidbot.xyz`, iconURL: interaction.user.displayAvatarURL() },
                config.colors.voidblue
            )

            interaction.editReply({ embeds: [embed], ephemeral: ephemeral == true ? true : false })


        } catch (e) {
            logger.log(e)
        }

    
    
        fs.unlink(path, (err) => {
            if (err) {
                logger.log(err);
                return;
            }
        });


            
    }
}
    

