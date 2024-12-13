const OpenAI = require('openai')
const config = require('../../config.json');
const { log } = require('./logger');


const openai_client = new OpenAI(
    { 
        apiKey: config.keys.voidai,
        baseURL: config.urls.voidai_base
    }
);
const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
module.exports = {

    describeImage: async function(prompt = null, data, url,) {

        const url_to_apply = data ? data.proxyURL : url
        var messages = {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": prompt !== null ? prompt : 'Describe the image.'
                },
                {
                    "type": "image_url",
                    "image_url": {
                    "url": url_to_apply
                },
            },
            ],
        };

        let found = false;

        try {
            imageExtensions.forEach(async(ex) => {
                if(url_to_apply.includes(ex)) {
                    found = true;
                }
            })

            if(found) {
                var response = await openai_client.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [messages]
                })

                var description = response.choices[0].message.content

                return { description, messages };

            } else {
                var description = `You uploaded an unsupported file, it must be below 20MB in size and must also be one of the following formats: 'png, jpeg, gif, webp'`
                var error = "unsupported"
                return { description, error }
            }





        } catch (e) {

            log(e)
            var description = `\`\`\`\n${e.message}\n\`\`\``
            var error = "unsupported"
            return { description, error }
            
        }


            


        

    }

}
