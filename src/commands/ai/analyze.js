const {
    ApplicationCommandOptionType,
    Client,
    Interaction,
    PermissionFlagsBits,
    EmbedBuilder,
} = require('discord.js');

const { shorten } = require('../../utils/shorten.js');
const config = require('../../../config.json');

const logger = require('../../utils/logger.js');
const embeds = require('../../utils/embeds.js');
const { analyze } = require('../../utils/analyze.js');

module.exports = {
    name: 'analyze',
    description: 'Analyze an audio file.',
    integration_types: [0, 1],
    contexts: [0, 1, 2], 
    options: [
    {
        name: 'audio',
        description: 'The audio to be analyzed.',
        required: false,
        type: ApplicationCommandOptionType.Attachment,
    },
    {
        name: 'url',
        description: 'The url to the target audio.',
        required: false,
        type: ApplicationCommandOptionType.String,
    },
    {
        name: 'prompt',
        description: 'Control how you want the output to be.',
        required: false,
        type: ApplicationCommandOptionType.String,
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

        const attachment = interaction.options.getAttachment('audio')
        const url = interaction.options.getString('url');
        const prompt = interaction.options.getString('prompt');
        const ephemeral = interaction.options.getBoolean('ephemeral');

        await interaction.deferReply({ ephemeral: ephemeral == true ? true : false })

        if(!attachment && !url) {
            return interaction.editReply({ embeds: [
                embeds.custom(                        
                    null,
                    `The command isn't complete, add either an audio file, or a url.`,
                    { text: `voidbot.xyz`, iconURL: interaction.user.displayAvatarURL() },
                    config.colors.red
                )
            ], ephemeral: ephemeral == true ? true : false  })
        }

        try {

            const response = await analyze(attachment || url, prompt)
            if(response == "failed") return interaction.editReply({ embeds: [
                embeds.custom(
                    null,
                    `An error occured while analyzing this audio file, make sure the file type is one of the supported extensions ("mp3", "wav").`,
                    { text: `voidbot.xyz`, iconURL: interaction.user.displayAvatarURL() },
                    config.colors.red
                )
            ], ephemeral: ephemeral == true ? true : false })


            const embed = embeds.custom(
                `Audio analysis result`,
                `${shorten(response, 4000)}`,
                { text: `voidbot.xyz`, iconURL: interaction.user.displayAvatarURL() },
                config.colors.voidblue
            )

            interaction.editReply({ embeds: [embed], ephemeral: ephemeral == true ? true : false })
            logger.ai_log(response)

        } catch (e) {
            logger.log(e)
        }
    
    }
}
