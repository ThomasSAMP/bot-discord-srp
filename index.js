const Discord = require('discord.js')
const bot = new Discord.Client()
const mysql = require('mysql')

let channel = '685250262721757216'

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
    console.log('Nouvelle sanction!')
    con.query('SELECT * FROM `sanctions`', function(error, results, fields) {
        results.forEach(element => {
            console.log(element['id'])
                //bot.channels.cache.get(channel).send(element['id']);
        });
    })
}


bot.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('Pong!');
    }
});

bot.login(process.env.TOKEN)