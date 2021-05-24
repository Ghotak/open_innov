const { CommandoClient } = require('discord.js-commando');
const path = require('path');

const client = new CommandoClient({
    commandPrefix: '-', 
    owner: '354709786870153228',
    invite: 'https://discord.gg/ur8hhzV2wV'
});

client.registry
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerGroup('music', 'Music')
    .registerCommandsIn(path.join(__dirname, 'commands'));


client.server = {
    queue: [],
    currentVideo: {url: "", title: "Aucune musique"},
    dispatcher: null,
    connection: null
};

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag} - (${client.user.id})`);
});

client.on('error', (error) => console.error(error));

client.login('ODEzNDA5NTM5MDI2MTkwMzU2.YDO4qg.h4DjJWHpR-HMXE9QlkyLjUEt-IM');