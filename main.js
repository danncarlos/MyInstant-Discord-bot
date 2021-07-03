const Discord = require('discord.js');
const audioService = require('./services/audioService.js');


const bot = new Discord.Client();
const token = 'ODQ2NzkwNjU0MTgwMzI3NDc1.YK0pQA.WjpOlXdN76zZCOLOHdHeda_4YmY';
const PREFIX = '!';

bot.login(token);

bot.on('ready', () => {
    console.log('this bot is ONLINE')
});

bot.on('message', async msg => {
    let args = msg.content.substring(PREFIX.length).split(' ');
    let command = args.shift().toLowerCase();
    if(command == 'mi'){
        if(validURL(args[0])){
            let audioUrl = await audioService.getMp3FromUrl(args[0]);
            audioService.sendToChat(msg, audioUrl);
        }
        else{
            let audioUrl = await audioService.getMp3FromSearch(args[0]);
            audioService.sendToChat(msg, audioUrl);
        }
    }
});

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}