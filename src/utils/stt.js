const OpenAI = require('openai')
const config = require('../../config.json');
const fs = require('fs');
const logger = require('../utils/logger');


const client = new OpenAI(
    { 
        apiKey: config.keys.voidai,
        baseURL: config.urls.voidai_base
    }
);

module.exports = {

    stt: async function(file_path) {

        try {

            const response = await client.audio.transcriptions.create({
                file: fs.createReadStream(file_path),
                model: "whisper-1",
                response_format: "text",
            });

            return response
    
        } catch (error) {
            logger.log("Error in TTS function:", error);
            throw error;
        }

    }

}


