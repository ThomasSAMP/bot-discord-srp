const Discord = require('discord.js')
const query = require('samp-query')
const bot = new Discord.Client()
const mysql = require('mysql')

let roleID = '685236404107608128'
let channel = '685250262721757216'
let Samp_IP = "51.178.16.121";
let Samp_Port = 7777;

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

    bot.user.setStatus('online')
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

function GetPlayersOnline(msg) {
    var options = {
        host: Samp_IP,
        port: Samp_Port
    }
    query(options, function(error, response) {
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
    if (!msg.member.roles.find("name", "Lead Admin")) {
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
    if (!msg.member.roles.find("name", "Lead Admin")) {
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
    if (msg.content === '!zebi') {
        msg.channel.send(`Server IP: ${Samp_IP}`);
    }
    if (msg.content === '!players') {
        GetPlayersOnline(msg)
    }
    if (msg.content === '!setip') {
        setSampIP(msg, param)
    }
    if (msg.content === '!setport') {
        setSampPort(msg, param)
    }
});

bot.login(process.env.TOKEN)