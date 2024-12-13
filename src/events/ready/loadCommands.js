const getLocalCommands = require('../../utils/getLocalCommands');
const Discord = require('discord.js')
const config = require('../../../config.json');
const logger = require('../../utils/logger');

BigInt.prototype.toJSON = function () {
  return this.toString();
};

module.exports = async(client) => {

    let commands = getLocalCommands();
    let CommandJSON = [];

    commands.forEach(command => {

        if ('callback' in command) {

            const COMMAND_JSON = command;

            if (COMMAND_JSON.canExternal === true) {

                if (COMMAND_JSON.integration_types) {
                    COMMAND_JSON.integration_types = COMMAND_JSON.integration_types;
                } else {
                    COMMAND_JSON.integration_types = [0];
                }

                if (COMMAND_JSON.contexts) {
                    COMMAND_JSON.contexts = COMMAND_JSON.contexts;
                } else {
                    COMMAND_JSON.contexts = [0];
                }

            } else {

                COMMAND_JSON.integration_types = [0];
                COMMAND_JSON.contexts = [0];
            }

            CommandJSON.push(COMMAND_JSON);

        } else {

            logger.log(`[WARNING] A command is missing a required "data" or "execute" property.`);
        }
        
    }); 


    const rest = new Discord.REST().setToken(config.discord_token);
    try {
        logger.log(`Started refreshing application commands.`);

        const data = await rest.put(
            Discord.Routes.applicationCommands(client.user.id), 
            { body: CommandJSON }
        );

        logger.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        logger.log(error);
    }
  
}

