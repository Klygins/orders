require('dotenv').config()
const axios = require('axios')

const sendMessage = () => {
    return new Promise((resolve, reject) => {
        try {
            const botMessage =
                `New order: ${newOrder.mmrFrom}-${newOrder.mmrTo} ` +
                `tokens:${newOrder.tokens} trophy lvl: ${newOrder.trophyLvl}
            payment: ${newOrder.payment * config.percent} @everyone \n
if u wanna take order go to https://dota-orders.ngrok.io/#/orders`
            const discordJson = {
                "content": botMessage,
                "tts": "false"
            }
            const token = process.env.discordToken
            axios({
                method: "POST",
                data: discordJson,
                headers: {
                    "Authorization":
                        `Bot ${token}`
                },
                url: config.discordUrl
            })
            resolve(true)
        } catch (error) { reject(error) }
    })
}

module.exports = { sendMessage }