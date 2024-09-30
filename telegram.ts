const {
    Bot,
    Keyboard,
    InlineKeyboard,
    GrammyError,
    HttpError,
} = require('grammy')

const axios = require('axios')
const logger = require('./logger')

require('dotenv').config()

const categories = [
    { slug: 'fashion', name: 'Мода 💅🏻', listener: 'button-1' },
    { slug: 'cars', name: 'Тачки 🚚', listener: 'button-2' },
    { slug: 'monkeys', name: 'Макаки 🐒', listener: 'button-3' },
    { slug: 'cats', name: 'Кашаки 🐈', listener: 'button-4' },
]

const bot = new Bot(process.env.BOT_API_KEY);

bot.start();

bot.command('start', async (ctx) => {
    const startKeyboard = new Keyboard()
        .text('Спиздить картинку')
        .text('Сьебаться с бота')
        .resized()

    await ctx.reply('Привет!', {
        reply_markup: startKeyboard
    });

    await ctx.react('👍')
})

bot.hears('Спиздить картинку', async (ctx) => {
    const inlineKeyboard = categories.reduce((acc, value) => {
        return acc.text(value.name, value.listener).row()
    }, new InlineKeyboard())

    await ctx.reply('Где спиздить?', {
        reply_markup: inlineKeyboard
    });
});

bot.hears('Сьебаться с бота', async (ctx) => {
   await ctx.leaveChat()
});

async function getPhoto(tag = 'cats'): Promise<string> {
    const url = 'https://api.giphy.com/v1/gifs/random'

    return await axios({
        method: 'GET',
        params: {
            api_key: process.env.GIPHY_API_KEY,
            tag
        },
        url
    }).then(_ => _.data.data.images["original"]["url"])
}

for (const category of categories) {
    bot.callbackQuery(category.listener, async (ctx) => {
        const inlineKeyboard = new InlineKeyboard()
            .text('Спизить еще', category.listener)

        const photo = await getPhoto(category.slug)

        await ctx.replyWithAnimation(photo, {
            reply_markup: inlineKeyboard
        })

        await ctx.answerCallbackQuery()

        logger.info(`Пользователь id-${ctx.from.id} спиздил категорию ${category.name}`)
    });
}

bot.catch(({ error: e }) => {
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});