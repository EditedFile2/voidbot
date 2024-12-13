const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    Embed,
    EmbedBuilder,
    Client,
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
    AttachmentBuilder,
    Interaction,
} = require('discord.js');

const config = require('../../../config.json')
const { describeImage } = require('../../utils/describeImage.js')

const logger = require('../../utils/logger.js');

module.exports = {
    // deleted: true,
    name: 'describe',
    description: 'Describes the image you give it. (Note: results may not be 100% accurate)',
    integration_types: [0, 1],
    contexts: [0, 1, 2], 
    options: [
    {
        name: 'image',
        description: 'The image to describe.',
        required: true,
        type: ApplicationCommandOptionType.Attachment,
    },
    {
        name: 'prompt',
        description: 'The prompt.',
        required: false,
        type: ApplicationCommandOptionType.String,
    },
    {
        name: 'ephemeral',
        description: 'Only shows to you.',
        required: false,
        type: ApplicationCommandOptionType.Boolean,
    }
    ],
    botPermissions: [
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.AttachFiles,
        PermissionFlagsBits.SendMessages,
    ],
    canExternal: true,

    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    
    callback: async(client, interaction) => {
        
        const image = interaction.options.getAttachment('image');
        const prompt = interaction.options.getString('prompt');
        const ephemeral = interaction.options.getBoolean('ephemeral');

        await interaction.deferReply({ ephemeral: ephemeral == true ? true : false })


        var response = await describeImage(prompt ? prompt : null, image).catch((err) => logger.log(err))

        return interaction.editReply({ embeds: [new EmbedBuilder({ title: `Image Description`, description: `${response.error == "unsupported" ? "You uploaded an unsupported file, it must be below 20MB in size and must also be one of the following formats: 'png, jpg, jpeg, gif, webp'" : response.description}`, footer: { text: `voidbot.xyz`, icon_url: interaction.user.displayAvatarURL() } })] })


    }

};
    