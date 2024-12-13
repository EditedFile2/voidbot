const {
    ApplicationCommandOptionType,
    Client,
    Interaction,
    PermissionFlagsBits,
} = require('discord.js');

const { splitTextIntoBlocks } = require('../../utils/splitTextIntoBlocks.js');

const OpenAI = require('openai');
const { generate } = require('../../utils/generate.js');
const config = require('../../../config.json');


var ask_history = {};

module.exports = {
    // deleted: true,
    name: 'ask',
    description: 'Ask a single prompt.',
    integration_types: [0, 1],
    contexts: [0, 1, 2], 
    options: [
        {
            name: 'prompt',
            description: 'The prompt to ask the AI.',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'ephemeral',
            description: 'Whether the response should only be visible to you or not.',
            required: false,
            type: ApplicationCommandOptionType.Boolean
        },
    ],
    botPermissions: [
        PermissionFlagsBits.SendMessagesInThreads,
        PermissionFlagsBits.SendMessages,
    ],
    canExternal: true,

    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    
    callback: async(client, interaction) => {

        const prompt =  interaction.options.getString('prompt');
        const ephemeral = interaction.options.getBoolean('ephemeral') || false;

        await interaction.deferReply({ ephemeral: ephemeral == true ? true : false })

        if(!ask_history[interaction.user.id]) {
             ask_history[interaction.user.id] = []
        }


        var messages = [
           ...ask_history[interaction.user.id]
        ];

        var main_response = await generate("gpt-4o-mini", prompt, messages)

        const split_into_blocks = splitTextIntoBlocks(main_response.answer)

        if(ephemeral == false) {
            split_into_blocks.forEach(async(block) => {
                await interaction.followUp({
                    content: block,
                    ephemeral: false,
                });
            })


        } else {
            split_into_blocks.forEach(async(block) => {

                await interaction.followUp({
                    content: block,
                    ephemeral: true,
                });


            })
        }

        ask_history[interaction.user.id] = main_response.history
    }
}