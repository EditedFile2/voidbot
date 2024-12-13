const OpenAI = require('openai')
const config = require('../../config.json');
const fs = require('fs');
const path = require('path');
const { AttachmentBuilder } = require('discord.js');
const logger = require('../utils/logger');


const openai_client = new OpenAI(
    { 
        apiKey: config.keys.voidai,
        baseURL: config.urls.voidai_base
    }
);



module.exports = {

    tts: async function(prompt, voice) {

        try {
            const speechFile = path.resolve("./speech.mp3");
    
            const response = await openai_client.audio.speech.create({
                model: "tts-1",
                voice: voice || "Alloy",
                input: prompt,
            });
    
            
            const buffer = Buffer.from(await response.arrayBuffer());
            await fs.writeFileSync(speechFile, buffer);

            const file = new AttachmentBuilder(speechFile, { name: `speech.mp3` })
    
            return { file, speechFile };

        } catch (error) {
            logger.log("Error in TTS function:", error);
            throw error;
        }

    }

}


