const {
    ApplicationCommandOptionType,
    Client,
    Interaction,
    PermissionFlagsBits,
    EmbedBuilder,
} = require('discord.js');

const { tts } = require('../../utils/tts.js')

const fs = require('fs')


const config = require('../../../config.json')


const logger = require('../../utils/logger.js');
const embeds = require('../../utils/embeds.js');

module.exports = {
    // deleted: true,
    name: 'tts',
    description: 'Convert text to speech audio.',
    integration_types: [0, 1],
    contexts: [0, 1, 2], 
    options: [
    {
        name: 'text',
        description: 'The text to be converted into audio.',
        required: true,
        type: ApplicationCommandOptionType.String,
    },
    {
        name: 'voice',
        description: 'Select the AI voice for the audio output.',
        required: false,
        type: ApplicationCommandOptionType.String,
        choices: config.ai_voices
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

        const text = await interaction.options.getString('text');
        const voice = await interaction.options.getString('voice')
        const ephemeral = await interaction.options.getBoolean('ephemeral');

        await interaction.deferReply({ ephemeral: ephemeral == true ? true : false })


        if(text.length > 512) {
            return interaction.editReply({
                embeds: [embeds.custom(
                    null,
                    'The prompt cannot have more than **512** characters.',
                    { text: `voidbot.xyz`, iconURL: interaction.user.displayAvatarURL() },
                    config.colors.red,
                    )],
                ephemeral: ephemeral == true ? true : false
            });
        }



        const response = await tts(text, voice ? voice.toLowerCase() : "alloy")
        await interaction.editReply({ content: `Your AI generated text to speech message:`, files: [response.file]})
        fs.unlinkSync(response.speechFile, (err) => {
            if (err) {
                logger.log(`Failed to delete the file: ${err}`);
            } else {
                logger.log(`File deleted: ${response.speechFile}`);
            }
        });



            
    }
}
    

