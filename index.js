const Discord = require('discord.js')
const query = require('samp-query')
const bot = new Discord.Client()
const mysql = require('mysql')

let channel = '685250262721757216'
let Samp_IP = "149.202.64.55";
let Samp_Port = 1200;

const con = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DB
})

con.connect(function(err) {
    console.log("MySQL connecté!")
})

bot.on("ready", async() => {

    console.log('Le bot est activé.')
    console.log(`Connecté en tant que ${bot.user.tag}!`);

    bot.user.setStatus('dnd')
    bot.user.setActivity('manger des daronnes')

    setInterval(newSanction, 2000);

})

function newSanction() {
    con.query('SELECT * FROM `sanctions` WHERE `discord_notif` = 0', function(error, results, fields) {
        results.forEach(element => {
            const msgEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Nouvelle sanction')
                .setAuthor('Stories Roleplay', 'https://i.ibb.co/WFZpZS7/logo-white-petit.png')
                .addFields({
                    name: "Joueur :",
                    value: element['joueur'],
                    inline: true
                }, {
                    name: "Admin :",
                    value: element['admin'],
                    inline: true
                }, {
                    name: "Raison :",
                    value: element['raison'],
                    inline: true
                })
                .setTimestamp()
                .setFooter('Message automatique envoyé le', 'https://i.ibb.co/WFZpZS7/logo-white-petit.png')

            con.query('UPDATE `sanctions` SET `discord_notif` = 1 WHERE `id`=' + element['id'])
            console.log('Nouvelle sanction: ID = ' + element['id'] + ' ADMIN = ' + element['admin'] + ' JOUEUR = ' + element['joueur'] + ' RAISON = ' + element['raison'])
            bot.channels.cache.get(channel).send(msgEmbed);
        });
    })

}

function GetPlayersOnline() {
    var options = {
        host: Samp_IP,
        port: Samp_Port
    }
    query(options, function(error, response) {
        if (error) {
            console.log(error)

            const msgEmbed = {
                embed: {
                    color: '#0099ff',
                    title: 'Un problème est survenu, merci de réessayer plus tard.',
                    color: embedColor,
                    fields: [
                        { name: 'Erreur:', value: error, inline: true },
                    ],
                }
            }
            bot.channels.cache.get(channel).send(msgEmbed);

        } else {

            const msgEmbed = {
                embed: {
                    title: 'Server Information',
                    color: '#0099ff',
                    fields: [
                        { name: 'IP', value: response['address'], inline: true },
                        { name: 'Joueurs en ligne', value: response['online'] + '/' + response['maxplayers'], inline: true }
                    ],
                }
            }
            bot.channels.cache.get(channel).send(msgEmbed);
        }
    })

}


bot.on('message', msg => {
    if (msg.content === '!players') {
        GetPlayersOnline();
    }
});

bot.login(process.env.TOKEN)