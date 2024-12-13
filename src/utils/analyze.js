const OpenAI = require('openai')
const config = require('../../config.json');
const logger = require('./logger');


const openai_client = new OpenAI(
    { 
        apiKey: config.keys.voidai,
        baseURL: config.urls.voidai_base
    }
);



module.exports = {

    analyze: async function(attachment, prompt = "What is in this recording?") {

        try {

            const url = attachment.url || attachment;
            const audioResponse = await fetch(url);
            const buffer = await audioResponse.arrayBuffer();
            const audio_data = Buffer.from(buffer).toString("base64");

            var parsedUrl = new URL(url);
            var pathname = parsedUrl.pathname;

            var match = pathname.match(/\.([^.\/\?]+)(\?.*)?$/);
            var extension = match ? match[1] : '';

            const response = await openai_client.chat.completions.create({
                model: "gpt-4o-audio-preview",
                modalities: ["text", "audio"],
                audio: { voice: "alloy", format: extension },
                messages: [
                    {
                    role: "user",
                    content: [
                        { type: "text", text: prompt || "What is in this recording?" },
                        { type: "input_audio", input_audio: { data: audio_data, format: extension }}
                    ]
                    }
                ]
            });
            
            const transcript = response.choices[0].message.audio.transcript
            
            return transcript;

        } catch (error) {
            logger.log(error);
            return 'failed'
        }

    }

}


