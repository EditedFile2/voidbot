module.exports = {

    shorten: function(text, maxLen = 256) {
		return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
	},

}