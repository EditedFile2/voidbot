const config = require('../../config.json')
const { getDate } = require('./getDate')

module.exports = {

    log: function(log) {

        if (log instanceof Error) {
            
            console.log(`${getDate()} [ERROR] ${log.stack}`)

        } else {
            console.log(`${getDate()} ${log}`)
        }

    },
    
    ai_log: function(text) {
        if(config.ai_logs == true) {
            console.log(`${getDate()} [AI_RESPONSE] ` + text)
        }

    }

}