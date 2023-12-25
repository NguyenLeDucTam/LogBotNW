const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blist')
		.setDescription('do something about those black-listed dummies')
		.addSubcommand(subcommand =>
			subcommand.setName('find')
			.setDescription('find a blacklisted person')
			.addStringOption(option => 
				option.setName('findname').
				setRequired(true).
				setDescription('Enter their name').
				setAutocomplete(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('delete')
			.setDescription('delete a blacklisted person')
			.addStringOption(option => 
				option.setName('deletename').
				setRequired(true).
				setDescription('Enter their name').
				setAutocomplete(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('update')
			.setDescription('update a blacklisted person')
			.addStringOption(option => 
				option.setName('updatename').
				setRequired(true).
				setDescription('Enter their name').
				setAutocomplete(true))
			.addStringOption(option => 
				option.setName('updatereason').
				setRequired(true).
				setDescription('Enter their fuckups').
				setAutocomplete(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('add')
			.setDescription('add a blacklisted person')
			.addStringOption(option => 
				option.setName('addname').
				setRequired(true).
				setDescription('Enter their name').
				setAutocomplete(true))
			.addStringOption(option => 
				option.setName('addreason').
				setDescription('Enter their fuckups').
				setAutocomplete(true)))
		,
	async execute(interaction) {
	},
};
