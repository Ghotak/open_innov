const { VoiceConnection } = require('discord.js');
const { Command, CommandoMessage } = require("discord.js-commando");
const ytdl = require('ytdl-core');
const { UserNotInVoiceChannel } = require('../../strings.json');
const { key } = require('../../config.json');
const ytsr = require('youtube-search');

module.exports = class PlayCommand extends Command{
    constructor(client){
        super(client, {
            name:'play',
            aliases:['p'],
            group: 'music',
            memberName: 'play',
            description: 'Lance une musique depuis Youtube.',
            args: [
                {
                    key: 'query',
                    prompt: 'Quelle musique veux tu lire ?',
                    type: 'string'
                }
            ]
        })
    } 
    
    /**
     * 
     * @param {CommandoMessage} message 
     * @param {String} query 
     */
    async run(message, {term}){
        const server = message.client.server;

        if(!message.member.voice.channel){
            return message.say(UserNotInVoiceChannel);
        }

        await message.member.voice.channel.join().then((connection) => {

            ytsr(term, { key: key, maxResults: 1, type: 'video' }).then((results) => {
                if(results.results[0]){
                    const foundVideo = { url: results.results[0].link, title: results.results[0].title};

                    if(server.currentVideo.url != ""){
                        server.queue.push(foundVideo);
                        return message.say("`" + foundVideo.title + "`" + " est ajouté à la file d'attente");
                    }

                    server.currentVideo = foundVideo;
                    this.runVideo(message, connection);
                }
            });
        });
    }

    /**
     * 
     * @param {CommandoMessage} message 
     * @param {VoiceConnection} connection 
     * @param {*} video 
     */
    async runVideo(message, connection){
        const server = message.client.server;
        const dispatcher = connection.play(ytdl(server.currentVideo.url, {filter: 'audioonly'}));

        server.queue.shift();
        server.dispatcher = dispatcher;
        server.connection = connection;

        dispatcher.on('finish', () => {
            if(server.queue[0]){
                server.currentVideo = server.queue[0];
                return this.runVideo(message, connection, server.currentVideo.url);
            }
        });

        return message.say("En train de jouer " + "`" + server.currentVideo.title + "`" +" :notes: ");
    }
}