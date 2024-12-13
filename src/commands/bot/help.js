const {
    Client,
    Interaction,
    PermissionFlagsBits,
    EmbedBuilder,
} = require('discord.js');

module.exports = {
    name: 'help',
    description: 'List of commands available.',
    integration_types: [0, 1],
    contexts: [0, 1, 2], 
    botPermissions: [
        PermissionFlagsBits.CreatePrivateThreads,
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.ReadMessageHistory,
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

        var embed = new EmbedBuilder()
        .setDescription(
            "🤖 **Bot Commands**\n\n" +
            "/help - Help Command (this).\n" +
            "/about voidbot - Information about voidbot.xyz.\n\n" +
    
            "🧠 **AI Commands**\n\n" +
            "/analyze - Analyzes an audio file according to a prompt.\n" + 
            "/ask - Ask the AI a question.\n" +
            "/tts - Convert text to speech.\n" +
            "/stt - Convert speech to text.\n\n" +
            "/generate image - Generate an image using AI.\n" +
            "/describe - Get a description for an image.\n\n" +
    
            "**Admin Controls**\n" +
            "/set channel - Set a default channel for AI commands (server admin only)."
        )
        .setFooter({ 
            text: "voidbot.xyz", 
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
        });

        await interaction.reply({ embeds: [embed] })

    }
}
    

