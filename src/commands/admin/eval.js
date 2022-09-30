const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');

const Guild = require('../../schemas/guildModel');
const mongoose = require('mongoose');
const clean = async (text) => {
	// If our input is a promise, await it before continuing
	if (text && text.constructor.name == "Promise")
		text = await text;
	
	// If the response isn't a string, `util.inspect()`
	// is used to 'stringify' the code in a safe way that
	// won't error out on objects with circular references
	// (like Collections, for example)
	if (typeof text !== "string")
		text = require("util").inspect(text, { depth: 1 });
	
	// Replace symbols with character code alternatives
	text = text
		.replace(/`/g, "`" + String.fromCharCode(8203))
		.replace(/@/g, "@" + String.fromCharCode(8203));
	
	// Send off the cleaned up result
	return text;
	}

module.exports = {
	help: {
		name: "eval",
		description: "Eval Code",
		slash: false,
		category: "admin",
		aliases: ["eval"],
		usage: "eval <code>",
		cooldown: 5,
		permission: "Administrator",
		deletemsg: false,
	},
	dev: true,
	run: async(client, message, args) => {

		try {
			
			const evaled = eval(args.join(" "));
	
			const cleaned = await clean(evaled);
			console.log(cleaned);
	
			// Reply in the channel with our result
			message.channel.send(`\`\`\`js\n${cleaned}\n\`\`\``);
		} catch (error) {
			// If an error is caught, then it is logged
			console.log(error);
			message.channel.send(`\`ERROR\` \`\`\`xl\n${cleaned}\n\`\`\``);
		}
	}
};