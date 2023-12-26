const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('banklog')
		.setDescription('managing the guild bank')
		.addSubcommand(subcommand =>
			subcommand.setName('deposit')
			.setDescription("deposit gold into the guild's bank")
			.addIntegerOption(option => 
				option.setName('goldamount').
				setRequired(true).
				setDescription('enter gold amount').
				setAutocomplete(true))
			.addStringOption(option => 
				option.setName('author')
				.setDescription('author of the deposit (ignore this if the gold come from you)')))
		.addSubcommand(subcommand =>
			subcommand.setName('withdrawal')
			.setDescription("withdraw gold from the guild's bank")
			.addIntegerOption(option => 
				option.setName('goldamount').
				setRequired(true).
				setDescription('enter gold amount').
				setAutocomplete(true))
			.addStringOption(option =>
				option.setName('reason')
				.setRequired(true)
				.setDescription('reason for withdrawal (try to keep it short)'))
			.addStringOption(option => 
				option.setName('author')
				.setDescription('author of the withdrawl (ignore this if you are withdrawling)')))
				,			
	async execute(interaction) {
	},
};
