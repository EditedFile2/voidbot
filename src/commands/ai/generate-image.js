const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    EmbedBuilder,
    Client,
    Interaction,
} = require('discord.js');

const config = require('../../../config.json')

const { generateImage } = require('../../utils/generateImage.js');
const logger = require('../../utils/logger.js');
const embeds = require('../../utils/embeds.js');


module.exports = {
    // deleted: true,
    name: 'generate',
    description: 'Generate an AI-based image. Note: Accuracy may vary. This command uses credits.',
    integration_types: [0, 1],
    contexts: [0, 1, 2], 
    options: [
    {
        name: "image",
        description: "Generate an AI-based image. Note: Accuracy may vary. This command uses credits.",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: 'prompt',
                description: 'The text input that guides the image generation.',
                required: true,
                type: ApplicationCommandOptionType.String,
            },
            {
                name: 'ephemeral',
                description: 'Visible only to you, ensuring the output remains private.',
                required: false,
                type: ApplicationCommandOptionType.Boolean,
            }       
        ]
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
        
        const prompt = interaction.options.getString('prompt');
        const ephemeral = interaction.options.getBoolean('ephemeral')

    
        await interaction.deferReply({ ephemeral: ephemeral == true ? true : false })


        const generated = await generateImage(prompt, "1024x1024")
        if(generated !== "failed" && generated !== "flagged") {

            const embed = new EmbedBuilder()
                .setDescription(`${prompt}`)
                .setImage('attachment://generated_image.png')
                .setFooter({ text: `voidbot.xyz`, iconURL: interaction.user.displayAvatarURL() })

            interaction.editReply({ embeds: [embed], files: [generated], ephemeral: ephemeral == true ? true : false  })

            return;

        } else if (generated == "flagged") {

            return interaction.editReply({
                embeds: [embeds.flag_embed(interaction)],
                ephemeral: ephemeral == true ? true : false
            });
        
        } else {

            return interaction.editReply({
                embeds: [embeds.custom(null, `Image generation failed, please try again later.`, { text: `voidbot.xyz`, iconURL: interaction.user.displayAvatarURL() }, config.colors.red)],
                ephemeral: ephemeral == true ? true : false
            });

        }
        
        
    }

};
    