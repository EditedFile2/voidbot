const path = require('path');
const getAllFiles = require('./getAllFiles');
const logger = require('../utils/logger')

module.exports = (exceptions = []) => {
    let localCommands = [];

    const commandCategories = getAllFiles(
        path.join(__dirname, '..', 'commands'),
        true
    );

    for (const commandCategory of commandCategories) {
        const commandFiles = getAllFiles(commandCategory);

        for (const commandFile of commandFiles) {
            try {
                const commandObject = require(commandFile);

                
                if (exceptions.includes(commandObject.name)) {
                    continue;
                }

                localCommands.push(commandObject);

            } catch (e) {
                logger.log(e)
                logger.log(`❌ Failed to load file: ${path.basename(commandFile)}, E: ${e}`)
            }


        }
    }

    return localCommands;
};
