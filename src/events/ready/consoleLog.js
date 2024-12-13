const logger = require("../../utils/logger");

module.exports = (client) => {
    logger.log(`✅ Logged in as ${client.user.tag} (${client.user.id})\n`);
};
