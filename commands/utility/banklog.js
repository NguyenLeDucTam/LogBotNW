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
				setAutocomplete(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('withdrawal')
			.setDescription("withdraw gold from the guild's bank")
			.addIntegerOption(option => 
				option.setName('goldamount').
				setRequired(true).
				setDescription('enter gold amount').
				setAutocomplete(true)))
				,			
	async execute(interaction) {
	},
};
