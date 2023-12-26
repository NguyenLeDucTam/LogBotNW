const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token,bankchannel,banklogchannel,blacklistlogchannel,blacklistchannel } = require('./config.json');
const {blackListSaved, bankLogSaved, currentBankSaved} = require('./data.json');
const { channel } = require('node:diagnostics_channel');
var blackList = blackListSaved
var bankLog = bankLogSaved
var currentBank = currentBankSaved
function saveDataToFile() {
	const data={
		bankLogSaved:bankLog,
		blackListSaved:blackList,
		currentBankSaved:currentBank
	};
    fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('/////////////////////////////////////////////////Error saving data:', err);
            return;
        }
        console.log('Data saved to file at', new Date().toLocaleString());
    });
}
const fiveHours = 5 * 60 * 60 * 1000;

setInterval(saveDataToFile, fiveHours);
function convertToEST() {
    const localTime = new Date();
    const localTimeOffset = localTime.getTimezoneOffset() * 60000;
    const utcTime = localTime.getTime() + localTimeOffset;
    const estOffset = -5 * 60 * 60000;
    const estTime = new Date(utcTime + estOffset);

    return estTime;
}


var dBankLog =bankLog.map(n=>n.split('-')[0].trimEnd());
var dBankLogTime = bankLog.map(n=>n.split("-")[1].trimStart().trimEnd())
var dBankLogAuthor = bankLog.map(n=>n.split("-")[2].trimStart().trimEnd())
var timeList ='';
	dBankLogTime.forEach(function(time){
		timeList+=time+"\n";
	})
	var bankAuthorList ='';
	dBankLogAuthor.forEach(function(author){
		bankAuthorList+=author+"\n";
	})
	var amountList='';
	dBankLog.forEach(function(amount){
		amountList+=amount+"\n";
	})
var eBlackList = blackList.map(n=>n.toLocaleLowerCase().split('-')[0].trimEnd());
var dBlackList =blackList.map(n=>n.split('-')[0].trimEnd());
	var dBlackListReason = blackList.map(n=>n.split("-")[1].trimStart().trimEnd())
	var dBlackListAuthor = blackList.map(n=>n.split("-")[2].trimStart().trimEnd())
	var reasonList ='';
	dBlackListReason.forEach(function(reason){
		reasonList+=reason+"\n";
	})
	var authorList ='';
	dBlackListAuthor.forEach(function(author){
		authorList+=author+"\n";
	})
	var nameList='';
	dBlackList.forEach(function(name){
		nameList+=name+"\n";
	})
var channelLog;
var bankchannellog;
function formatDateTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const days = date.getDate().toString().padStart(2, '0');
    const month = date.getMonth().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minute} ${days}/${month}`;
}
const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Black list')
    .setDescription('Avoid doing m2/m3 with these names');
	embed.addFields(
		{ name: 'Names', value: nameList, inline: true },
		{ name: 'Reason', value: reasonList, inline: true },
		{ name: 'Author', value: authorList, inline: true }
	);

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildIntegrations
	],
});
const bankEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle("Guild's bank log")
    .setDescription(`Current bank gold is: ${currentBank}`);
	bankEmbed.addFields(
		{ name: 'Amount', value: amountList, inline: true },
		{ name: 'Time', value: timeList, inline: true },
		{ name: 'Author', value: bankAuthorList, inline: true }
	);
var embedId;
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, readyClient => {
	saveDataToFile()
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	try {
		channelLog =client.channels.fetch(blacklistchannel)
		.then(async channel => {embedId = await channel.send({ embeds: [embed] })})
		.catch(err => console.error(err));
		channelLog =client.channels.fetch(bankchannel)
		.then(async channel => {bankMessage = await channel.send ({embeds: [bankEmbed]})})
		.catch(err => console.error(err));
	} catch (err){
		console.log("error with creating embed message: ", err)
	}
	
	
});
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}


    if (interaction.commandName === 'blist') {
		try{
			const action = interaction.options.getSubcommand();
			if (action ==='find'){
				const userInput = interaction.options.getString('findname')
				if (userInput != null){
					const qNames = eBlackList.filter(n=>n.toLocaleLowerCase().includes(userInput.toLocaleLowerCase()))
				await interaction.reply({content:`Found: ${qNames}`,ephemeral: true}); 
				}
				else{await interaction.reply({content:`could not found anyone with that name`,ephemeral: true}); }
				
			}
			if (action ==='delete'){
				const userInput = interaction.options.getString('deletename')
				if (userInput != null){
					const index = eBlackList.indexOf(userInput.toLocaleLowerCase());
					if (index != -1){
						blackList.splice(index,1);
						eBlackList.splice(index,1);
						var dBlackList =blackList.map(n=>n.split('-')[0].trimEnd());
						var dBlackListReason = blackList.map(n=>n.split("-")[1].trimStart().trimEnd())
						var dBlackListAuthor = blackList.map(n=>n.split("-")[2].trimStart().trimEnd())
						var reasonList ='';
						dBlackListReason.forEach(function(reason){
							reasonList+=reason+"\n";
						})
						var authorList ='';
						dBlackListAuthor.forEach(function(author){
							authorList+=author+"\n";
						})
						var nameList='';
						dBlackList.forEach(function(name){
							nameList+=name+"\n";
						})
						console.log(nameList)
						const oldEmbed = embedId.embeds[0];
						const newEmbed = EmbedBuilder.from(oldEmbed)
						.setFields(
							{ name: 'Name', value: nameList, inline: true },
							{ name: 'Reason', value: reasonList, inline: true },
							{ name: 'Author', value: authorList, inline: true }
						);
						await embedId.edit({embeds: [newEmbed]})
						try{
							channelLog =client.channels.fetch(blacklistlogchannel).then(channel => 
								channel.send(`**${userInput}** was deleted off the blacklist by **${interaction.member.displayName}** on **${convertToEST()}**`))
							await interaction.reply({content:`Deleted: ${userInput}`,ephemeral: true}); 
						}
						catch(err){
							console.error("Error while trying to sending message: ",err)
						}
					
					}
					else{await interaction.reply({content:`could not found anyone with that name`,ephemeral: true}); }
					
				}
				else {
					await interaction.reply({content:`could not found anyone with that name`,ephemeral: true}); 
				}
				
			}
			if (action ==='add'){
				const userInput = interaction.options.getString('addname')
				var userReason = interaction.options.getString('addreason')
				if (userReason==null){userReason=""}
				const qNames = eBlackList.filter(n=>n.toLocaleLowerCase().includes(userInput.toLocaleLowerCase()))
				if (qNames.length>0){
					await interaction.reply({content:`already in the blacklist`,ephemeral: true}); 
				}
				else {
						blackList.push(userInput+" - "+userReason+" - "+interaction.member.displayName)
						console.log(blackList)
						eBlackList.push(userInput.toLocaleLowerCase())
						var dBlackList =blackList.map(n=>n.split('-')[0].trimEnd());
						var dBlackListReason = blackList.map(n=>n.split("-")[1].trimStart().trimEnd())
						var dBlackListAuthor = blackList.map(n=>n.split("-")[2].trimStart().trimEnd())
						var reasonList ='';
						dBlackListReason.forEach(function(reason){
							reasonList+=reason+"\n";
						})
						var authorList ='';
						dBlackListAuthor.forEach(function(author){
							authorList+=author+"\n";
						})
						var nameList='';
						dBlackList.forEach(function(name){
							nameList+=name+"\n";
						})
						console.log(nameList)
						const oldEmbed = embedId.embeds[0];
						const newEmbed = EmbedBuilder.from(oldEmbed)
						.setFields(
							{ name: 'Name', value: nameList, inline: true },
							{ name: 'Reason', value: reasonList, inline: true },
							{ name: 'Author', value: authorList, inline: true }
						);
						try {
							await embedId.edit({embeds: [newEmbed]})
							channelLog =client.channels.fetch(blacklistlogchannel).then(channel => 
								{channel.send(`**${userInput}** was added to the blacklist by **${interaction.member.displayName}** on **${convertToEST()}**`)
								})
								
							await interaction.reply({content:`Added: ${userInput}`,ephemeral: true}); 
						}catch(err){
							console.error("Error while trying to sending message: ",err)
						}
						
				}
			}
			if (action ==='update'){
				const userInput = interaction.options.getString('updatename')
				const userReason = interaction.options.getString('updatereason')
				const qNames = eBlackList.indexOf(userInput.toLocaleLowerCase());
				if (qNames != -1){
					blackList[qNames] = blackList[qNames].split('-')[0].trimEnd() + " - "+userReason+" - "+interaction.member.displayName
					var dBlackList =blackList.map(n=>n.split('-')[0].trimEnd());
						var dBlackListReason = blackList.map(n=>n.split("-")[1].trimStart().trimEnd())
						var dBlackListAuthor = blackList.map(n=>n.split("-")[2].trimStart().trimEnd())
						var reasonList ='';
						dBlackListReason.forEach(function(reason){
							reasonList+=reason+"\n";
						})
						var authorList ='';
						dBlackListAuthor.forEach(function(author){
							authorList+=author+"\n";
						})
						var nameList='';
						dBlackList.forEach(function(name){
							nameList+=name+"\n";
						})
						console.log(nameList)
						const oldEmbed = embedId.embeds[0];
						const newEmbed = EmbedBuilder.from(oldEmbed)
						.setFields(
							{ name: 'Name', value: nameList, inline: true },
							{ name: 'Reason', value: reasonList, inline: true },
							{ name: 'Author', value: authorList, inline: true }
						);
						try {
							await embedId.edit({embeds: [newEmbed]})
							await interaction.reply({content:`updated ${userInput}`,ephemeral: true}); 
						}
						catch (err){
							console.error("Error while trying to sending message: ",err)
						}
						
				}
				else{
					await interaction.reply({content:`could not find this person`,ephemeral: true}); 
				}
	
			}
		}
		catch(err){
			console.error("error in interaction: ",err)
		}
        
    }
	if (interaction.commandName === 'banklog') {
		try{
			const action = interaction.options.getSubcommand();
			if (action ==='deposit'){
				const userInput = interaction.options.getInteger('goldamount')
				
				if (userInput <=0){
					await interaction.reply({content:`can't add that shit to the bank`,ephemeral: true}); 
				}
				else {
						const author = interaction.options.getString('author')
						if (author != null){
							bankLog.push(userInput.toLocaleString('de-DE')+" - "+formatDateTime(convertToEST())+" - "+author)
						}
						else{
							bankLog.push(userInput.toLocaleString('de-DE')+" - "+formatDateTime(convertToEST())+" - "+interaction.member.displayName)
						}
						
						var dBankLog =bankLog.map(n=>n.split('-')[0].trimEnd());
						var dBankLogTime = bankLog.map(n=>n.split("-")[1].trimStart().trimEnd())
						var dBankLogAuthor = bankLog.map(n=>n.split("-")[2].trimStart().trimEnd())
						var timeList ='';
							dBankLogTime.forEach(function(time){
								timeList+=time+"\n";
							})
							var bankAuthorList ='';
							dBankLogAuthor.forEach(function(author){
								bankAuthorList+=author+"\n";
							})
							var amountList='';
							dBankLog.forEach(function(amount){
								amountList+=amount+"\n";
							})
						currentBank += userInput;
						const oldEmbed = bankMessage.embeds[0];
						const newEmbed = EmbedBuilder.from(oldEmbed)
						.setFields(
							{ name: 'Amount', value: amountList, inline: true },
							{ name: 'Date', value: timeList, inline: true },
							{ name: 'Author', value: bankAuthorList, inline: true }
						).setDescription(`Current bank gold is: ${currentBank}`);
						try {
							await bankMessage.edit({embeds: [newEmbed]})
							if (author!=null){
								channelLog =client.channels.fetch(bankchannel).then(channel => 
									{channel.send(`**${userInput.toLocaleString('de-DE')}g** was added to the guild by **${interaction.member.displayName}** on behalf of **${author}** on **${convertToEST()}**`)
									})
							}
							else{
								channelLog =client.channels.fetch(bankchannel).then(channel => 
									{channel.send(`**${userInput.toLocaleString('de-DE')}g** was added to the guild by **${interaction.member.displayName}** on **${convertToEST()}**`)
									})
									
							}
							
							await interaction.reply({content:`Deposited to the bank: ${userInput.toLocaleString('de-DE')}g`,ephemeral: true}); 
							
						}catch(err){
							console.error("Error while trying to sending message: ",err)
						}
						
				}
			}
			if (action ==='withdrawal'){
				const userInput = interaction.options.getInteger('goldamount')
				const author = interaction.options.getString('author')
				const withdrawReason = interaction.options.getString('reason')
				if (userInput <=0){
					await interaction.reply({content:`can't add that shit to the bank`,ephemeral: true}); 
				}
				else {
						if (author !=null){
							bankLog.push("~"+userInput.toLocaleString('de-DE')+" - "+formatDateTime(convertToEST())+" - "+author+`: ${withdrawReason}`)
						}
						else{
							bankLog.push("~"+userInput.toLocaleString('de-DE')+" - "+formatDateTime(convertToEST())+" - "+interaction.member.displayName+`: ${withdrawReason}`)
						}
						
						var dBankLog =bankLog.map(n=>n.split('-')[0].trimEnd());
						var dBankLogTime = bankLog.map(n=>n.split("-")[1].trimStart().trimEnd())
						var dBankLogAuthor = bankLog.map(n=>n.split("-")[2].trimStart().trimEnd())
						var timeList ='';
							dBankLogTime.forEach(function(time){
								timeList+=time+"\n";
							})
							var bankAuthorList ='';
							dBankLogAuthor.forEach(function(author){
								bankAuthorList+=author+"\n";
							})
							var amountList='';
							dBankLog.forEach(function(amount){
								amountList+=amount+"\n";
							})
						currentBank -= userInput;
						const oldEmbed = bankMessage.embeds[0];
						const newEmbed = EmbedBuilder.from(oldEmbed)
						.setFields(
							{ name: 'Amount', value: amountList, inline: true },
							{ name: 'Date', value: timeList, inline: true },
							{ name: 'Author', value: bankAuthorList, inline: true }
						).setDescription(`Current bank gold is: ${currentBank}`);
						try {
							await bankMessage.edit({embeds: [newEmbed]})
							if (author != null){
								client.channels.fetch(bankchannel).then(channel => 
									{channel.send(`**${userInput.toLocaleString('de-DE')}g** was withdrawn from the guild by **${interaction.member.displayName}** on behalf of **${author}** on **${convertToEST()}** \n **Reason:** ${withdrawReason}`)
									})
							}
							else{
								client.channels.fetch(bankchannel).then(channel => 
									{channel.send(`**${userInput.toLocaleString('de-DE')}g** was withdrawn from the guild by **${interaction.member.displayName}** on **${convertToEST()}** \n **Reason:** ${withdrawReason}`)
									})
							}
							
								
							await interaction.reply({content:`Withdrawn from the bank: ${userInput.toLocaleString('de-DE')}g`,ephemeral: true}); 
						}catch(err){
							console.error("Error while trying to sending message: ",err)
						}
						
				}
			}


		}
		catch(err){
			console.error("error in interaction: ",err)
		}
        
    }
	
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(token);
