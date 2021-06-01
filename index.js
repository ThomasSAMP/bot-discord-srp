const Discord = require('discord.js')
const query = require('samp-query')
const bot = new Discord.Client()
const mysql = require('mysql')

let channel = '781084118842605568'
let Samp_IP = "51.178.41.211";
let Samp_Port = 3404;
let logo = "https://storiesrp.fr/site/img/logo.png";

const con = mysql.createConnection({
    host: "51.178.41.211",
    user: "storiesrp",
    password: "8EBeTOMA61wi",
    database: "gtrp"
})

con.connect(function (err) {
    console.log("MySQL connecté!")
})

bot.on("ready", async () => {

    console.log('Le bot est activé.')
    console.log(`Connecté en tant que ${bot.user.tag}!`);

    bot.user.setStatus('online')
    bot.user.setActivity('manger des daronnes')

    setInterval(newSanction, 2000);

})

function newSanction() {
    con.query('SELECT * FROM `gtrp_sanctions` WHERE `discord_notif` = 0', function (error, results, fields) {
        results.forEach(element => {
            const msgEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Nouvelle sanction')
                .setAuthor('Stories Roleplay', logo)
                .addFields({
                    name: "Joueur :",
                    value: element['player'],
                    inline: true
                }, {
                    name: "Admin :",
                    value: element['admin'],
                    inline: true
                }, {
                    name: "IP :",
                    value: element['ip'],
                    inline: true
                })
                .setTimestamp()
                .setFooter('Message automatique envoyé le')

            if (element['type'] == 0) {
                msgEmbed.addFields({
                    name: "Type :",
                    value: "Kick",
                    inline: true
                })
            }
            if (element['type'] == 1 || element['type'] == 2) {
                msgEmbed.addFields({
                    name: "Type :",
                    value: "TKick",
                    inline: true
                })
            }
            if (element['type'] == 3 || element['type'] == 4) {
                msgEmbed.addFields({
                    name: "Type :",
                    value: "Mute",
                    inline: true
                }, {
                    name: "Durée :",
                    value: element['params'] + "min",
                    inline: true
                })
            }
            if (element['type'] == 5 || element['type'] == 6) {
                msgEmbed.addFields({
                    name: "Type :",
                    value: "Jail",
                    inline: true
                }, {
                    name: "Durée :",
                    value: element['params'] + "min",
                    inline: true
                })
            }
            if (element['type'] == 7 || element['type'] == 8 || element['type'] == 9 || element['type'] == 10 || element['type'] == 11) {
                msgEmbed.addFields({
                    name: "Type :",
                    value: "Ban",
                    inline: true
                }, {
                    name: "Durée :",
                    value: element['params'],
                    inline: true
                })
            }

            con.query('UPDATE `gtrp_sanctions` SET `discord_notif` = 1 WHERE `id`=' + element['id'])
            console.log('Nouvelle sanction: ID = ' + element['id'] + ' ADMIN = ' + element['admin'] + ' JOUEUR = ' + element['joueur'] + ' RAISON = ' + element['raison'])
            bot.channels.cache.get(channel).send(msgEmbed);
        });
    })

}

function GetPlayersOnline(msg) {
    var options = {
        host: Samp_IP,
        port: Samp_Port
    }
    query(options, function (error, response) {
        if (error) {
            console.log(error)

            const msgEmbed = {
                embed: {
                    title: 'Un problème est survenu, merci de réessayer plus tard.',
                    color: '#0099ff',
                    fields: [
                        { name: 'Erreur:', value: error, inline: true },
                    ],
                }
            }
            msg.channel.send(msgEmbed)

        } else {

            const msgEmbed = {
                embed: {
                    title: 'Information Serveur',
                    color: '#0099ff',
                    fields: [
                        { name: 'IP', value: response['address'], inline: false },
                        { name: 'Joueurs en ligne', value: response['online'] + '/' + response['maxplayers'], inline: false }
                    ],
                }
            }
            msg.channel.send(msgEmbed)
        }
    })

}

const setSampIP = (msg, param) => {
    if (!msg.guild) {
        msg.reply("This command can only be used in a guild.");
        return;
    }
    if (!msg.member.roles.cache.some(r => ["Lead Admin", "Gestion Serveur", "Fondateur"].includes(r.name))) {
        msg.reply("Vous ne pouvez pas utiliser cette commande.")
        return;
    }
    if (!param) {
        msg.reply("Utilisation: !setip [ip sans le port] \n Exemple: !setip 127.0.0.1")
        return;
    }
    Samp_IP = param;
    msg.channel.send(`IP du serveur modifiée : ${Samp_IP}`);
};

const setSampPort = (msg, param) => {
    if (!msg.guild) {
        msg.reply("This command can only be used in a guild.");
        return;
    }
    if (!msg.member.roles.cache.some(r => ["Lead Admin", "Gestion Serveur", "Fondateur"].includes(r.name))) {
        msg.reply("Vous ne pouvez pas utiliser cette commande.")
        return;
    }
    if (!param) {
        msg.reply("Utilisation: !setport [port] \n Exemple: !setport 7777")
        return;
    }
    if (!isNaN(param)) {
        Samp_Port = Number(param);
        msg.channel.send(`Port du serveur modifié : ${Samp_Port}`);
    }
};


bot.on('message', msg => {
    let parameters = [];

    if (msg.content === '!players') {
        GetPlayersOnline(msg)
    }
    if (msg.content === '!setip') {
        setSampIP(msg, parameters.join(" "))
    }
    if (msg.content === '!setport') {
        setSampPort(msg, parameters.join(" "))
    }
});

bot.login("ODI1ODAzMzc4MDgzNzU4MTMx.YGDPVA.AjumpmzYH4SL5sDpw5zefMhm_rQ")