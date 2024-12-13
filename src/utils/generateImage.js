const axios = require('axios')
const { AttachmentBuilder, EmbedBuilder } = require('discord.js')
const { Buffer } = require('buffer')
const logger = require('./logger.js')
const { shorten } = require('./shorten.js')
const config = require('../../config.json')

const OpenAI = require('openai');

module.exports = {

    generateImage: async function(prompt, size = "1024x1024") {
        try {

            const openai_client = new OpenAI(
                { 
                    apiKey: config.keys.voidai,
                    baseURL: config.urls.voidai_base
                }
            );

            try { 
                const response = await openai_client.images.generate({
                    model: "dall-e-3", prompt: prompt, n: 1, size: size, quality: "hd"
                });

                const imageUrl = response.data[0].url;

                const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                const imageData = Buffer.from(imageResponse.data, 'binary');

                const file = new AttachmentBuilder(imageData, { name: `./generated_image.png` });
                // return {file, revised_prompt}
                return file
            } catch (error) {
                logger.log(error)
                if(error.message.includes("safety system")) {
                    return "flagged"
                } else {
                    return "failed";
                }
                
            }


        } catch (error) {
            logger.log(error)
            if(error.message.includes("safety system")) {
                return "flagged"
            } else {
                return "failed";
            }
        }
    }


}
