var config = require('../../config.json');
var OpenAI = require('openai');
const logger = require('./logger');




var client = new OpenAI(
    { 
        apiKey: config.keys.voidai,
        baseURL: config.urls.voidai_base
    }
);




module.exports = {
    generate: async function(model = "chatgpt-4o-latest", prompt, messages = []) {

        messages.push({ "role": "user", "content": prompt })

        try {
                
            var response = await client.chat.completions.create({
                model: model,
                messages: messages
            })

            messages.push({
                "role": "assistant",
                "content": response.choices[0].message.content,
            })


            var answer = response.choices[0].message.content
            var history = messages

            return { answer, history };
            
        } catch(e) {
            logger.log(e)
            var answer = "failed"
            return { answer, history }
        }

    }
};



