const Discord = require('discord.js')
const bot = new Discord.Client()
const mysql = require('mysql')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// const con = mysql.createConnection({
//     host: "anderts899.mysql.db",
//     user: "anderts899",
//     password: "iG73U7dhH",
//     database: "anderts899"
// })

// con.connect(function(err) {
//     console.log("MySQL connected!")
// })

bot.on("ready", async() => {
    console.log("Bot is ready.")
    bot.user.setStatus("dnd")
    bot.user.setActivity("manger des daronnes")

    const channel = bot.channels.cache.get('685250262721757216')

    channel.send('Salut salut')

    // for (var i = 1; i > 0; i++) {
    //     console.log('salut')
    //     con.query('SELECT * FROM `users`', function(error, results, fields) {
    //         //channel.send('ID: ' + results[0]['id'] + 'Name: ' + results[0]['name'] + 'Email: ' + results[0]['email'] + 'VIP: ' + results[0]['vip'])
    //         //console.log(results[0]['id'])
    //     })
    //     await sleep(10000)
    // }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------- //

    bot.on('message', msg => {
        if (msg.content === 'ping') {
            msg.reply('Pong!');
        }
    });

})

bot.login(process.env.TOKEN)