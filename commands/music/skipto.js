const { Command, CommandoMessage } = require("discord.js-commando");
const { UserNotInVoiceChannel, BotNotInVoiceChannel } = require('../../strings.json');
const ytdl = require('ytdl-core');

module.exports = class SkipToCommand extends Command{
    constructor(client){
        super(client, {
            name:'skipto',
            group: 'music',
            memberName: 'skipto',
            description: "Passe à la musique que l'on souhaite dans la file d'attente (skipto 4)",
            args : [
                {
                    key: 'index',
                    prompt: "A quelle position de la file d'attente veux tu te rendre ?",
                    type: 'integer'
                }
            ]
        })
    } 
    
    /**
     * 
     * @param {CommandoMessage} message 
     * @param {String} query 
     */
    async run(message, {index}){
        const voiceChannel = message.member.voice.channel;
        const server = message.client.server;

        console.log(message.member.voice.channel)
        if(!voiceChannel){
            return message.say(UserNotInVoiceChannel);
        }

        if(!message.client.voice.connections.first()){
            return message.say(BotNotInVoiceChannel);
        }

        index--;

        if(!server.queue[index]){
            server.currentVideo = {url: "", title: "Aucune musique"};
            return message.say("Aucune musique trouvée dans la fille d'attente");
        }

        server.currentVideo = server.queue[index];
        server.dispatcher = server.connection.play(await ytdl(server.currentVideo.url, {filter: 'audioonly'}));
        server.queue.splice(index, 1);

        return message.say(":fast_forward: Musique ignorée :thumbsup:");
    }
}