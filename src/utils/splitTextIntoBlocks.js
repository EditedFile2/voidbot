module.exports = {


    splitTextIntoBlocks: function(text, maxLen = 1950) {
        if (text.length <= maxLen) {
            return [text];
        }

        const blocks = [];
        for (let i = 0; i < text.length; i += maxLen) {
            blocks.push(text.slice(i, i + maxLen));
        }

        return blocks;
    }

}