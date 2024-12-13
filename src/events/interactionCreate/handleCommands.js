const {
    devs,
} = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');
const logger = require('../../utils/logger');
const {
    EmbedBuilder,
} = require('discord.js');


const debounce = new Set()

module.exports = async (client, interaction) => {

    if (!interaction.isChatInputCommand()) return;
    if (interaction.user.bot) return;

    const localCommands = getLocalCommands();

    try {
        const commandObject = localCommands.find(
            (cmd) => cmd.name === interaction.commandName
        );

        if (!commandObject) return;

        const user_id = interaction.guild ? interaction.member.id : interaction.user.id;
        const guild_id = interaction.guild ? interaction.guild.id : null



        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (interaction.guild) {
                    if (!interaction.member.permissions.has(permission) && interaction.member.id !== "1242863285368393738") {
                        interaction.reply({
                            content: 'You do not have permission to run this command!',
                            ephemeral: true,
                        });
                        return;
                    }
                }
            }
        }

        if (commandObject.botPermissions?.length) {
            if (interaction.guild) {
                for (const permission of commandObject.botPermissions) {
                    const bot = interaction.guild.members.me;

                    if (!bot.permissions.has(permission)) {
                        interaction.reply({
                            content: "I don't have enough permissions!",
                            ephemeral: true,
                        });
                        logger.log(interaction.guild.members.me.permissions.toArray())
                        return;
                    }
                }
            }
        }


        if (debounce.has(interaction.user.id)) {
            return await interaction.reply({
                content: "You must wait until the previous command finishes executing.",
                ephemeral: true,
            });
        }


        debounce.add(interaction.user.id);

        await commandObject.callback(client, interaction).catch(async(err) => {
            logger.log(err)
            setTimeout(() => {
                debounce.delete(interaction.user.id);
            }, 500);
        })

        setTimeout(() => {
            debounce.delete(interaction.user.id);
        }, 500);


    } catch (error) {
        logger.log(error);
        setTimeout(() => {
            debounce.delete(interaction.user.id);
        }, 500);
    }
};
