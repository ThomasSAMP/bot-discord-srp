const Discord = require('discord.js')
const bot = new Discord.Client()
const mysql = require('mysql')

const channel = bot.channels.cache.get('685250262721757216')

const con = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DB
})

con.connect(function(err) {
    console.log("MySQL connected!")
})

bot.on("ready", async() => {

    console.log('Le bot est activé.')
    console.log(`Connecté en tant que ${bot.user.tag}!`);

    bot.user.setStatus('dnd')
    bot.user.setActivity('manger des daronnes')

    setInterval(newSanction, 2000000);

})

function newSanction() {
    console.log('Nouvelle sanction!')
    con.query('SELECT * FROM `sanctions`', function(error, results, fields) {
        // channel.send('ID: ' + results[0]['id'] + 'Name: ' + results[0]['name'] + 'Email: ' + results[0]['email'] + 'VIP: ' + results[0]['vip'])
        results.forEach(element => {
            channel.send('ID: ' + element['id'] + 'Admin: ' + element['admin'] + 'Joueur: ' + element['joueur'] + 'Raison: ' + element['raison'] + 'DiscordSend: ' + element['discord_notif'])
        });
    })
}


bot.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('Pong!');
    }
});

bot.login(process.env.TOKEN)