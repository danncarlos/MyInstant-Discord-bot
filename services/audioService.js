const Discord = require('discord.js');
const axios = require('axios').default;
const cheerio = require('cheerio');

const searchUrl = 'https://www.myinstants.com/search/?name=';
const baseUrl = 'https://www.myinstants.com';
const SLEEP = 120000;


module.exports = {
    /**
    * @param {Discord.Message} msg The date
    * @param {string} audio The string
    */
    sendToChat: async function(msg, audioUrl){
        if(audioUrl == "") return;
        await msg.member.voice.channel.join().then(connection => {
            connection.play(audioUrl, {
                volume: 0.5
            });

            setTimeout(() => {
                console.log(`${SLEEP} second's pause`);
                connection.disconnect(); 
            }, SLEEP);
        });
    },

    getMp3FromSearch: async function(param){
        let resultUrl = "";
        await axios.get(searchUrl+param).then((result) => {
            if(result.status === 200){
                const htmlContent = result.data;
                const $ = cheerio.load(htmlContent);
                let resultDiv = $("#instants_container");

                let instantContainer = resultDiv.find($('.instant')).first();
                let instantButton = instantContainer.find($('.small-button')).first();

                let atributos = instantButton.attr();
                resultUrl = this.getFormatedUrl(atributos.onmousedown)
            }
        }).catch(console.error);
        
        return resultUrl;
    },

    getMp3FromUrl: async function(msg, audioUrl){
        let resultUrl = "";
        await axios.get(msg).then((result) => {
            if(result.status === 200){
                const htmlContent = result.data;
                const $ = cheerio.load(htmlContent);
                let btn = $('#instant-page-button');
                let atributos = btn.attr();
                resultUrl = this.getFormatedUrl(atributos.onmousedown);
            }
        }).catch(console.error);

        return resultUrl;
    },

    getFormatedUrl: function(url){
        let audioSource = url.substring(6, url.length - 2);
        return baseUrl + audioSource;
    }
}
