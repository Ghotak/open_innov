const { Command, CommandoMessage } = require("discord.js-commando");
const{ StreamDispatcher } = require('discord.js');
const { BotNotInVoiceChannel, UserNotInVoiceChannel } = require('../../strings.json');


module.exports = class ResumeCommand extends Command{
    constructor(client){
        super(client, {
            name:'resume',
            group: 'music',
            memberName: 'resume',
            description: 'Remet la musique qui était en pause'
        })
    } 

    async run(message){
        /**
         * @type StreamDispatcher
         */
        const dispatcher = message.client.server.dispatcher;

        console.log(message.member.voice.channel)
        if(!message.member.voice.channel){
            return message.say(UserNotInVoiceChannel);
        }

        if(!message.client.voice.connections.first()){
            return message.say(BotNotInVoiceChannel);
        }

        if(dispatcher){
            dispatcher.resume();
        }

        return message.say("En train de jouer :notes:");
    }
}