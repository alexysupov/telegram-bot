const { Bot, Keyboard, InlineKeyboard } = require('grammy');
const axios = require('axios')
require('dotenv').config()

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
});

bot.hears('Спиздить картинку', async (ctx) => {
    const inlineKeyboard = new InlineKeyboard()
        .text('Мода', 'button-1')
        .text('Тачки', 'button-2')
        .text('Кашаки', 'button-3')
        .text('Макаки', 'button-4')

    await ctx.reply('Где спиздить?', {
        reply_markup: inlineKeyboard
    });
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

bot.callbackQuery('button-1', async (ctx) => {
    const photo = await getPhoto('fashion')
    await ctx.replyWithAnimation(photo)
    await ctx.answerCallbackQuery()
});

bot.callbackQuery('button-2', async (ctx) => {
    const photo = await getPhoto('cars')
    await ctx.replyWithAnimation(photo)
    await ctx.answerCallbackQuery()
});

bot.callbackQuery('button-3', async (ctx) => {
    const photo = await getPhoto('cats')
    await ctx.replyWithAnimation(photo)
    await ctx.answerCallbackQuery()
});

bot.callbackQuery('button-4', async (ctx) => {
    const photo = await getPhoto('monkeys')
    await ctx.replyWithAnimation(photo)
    await ctx.answerCallbackQuery()
});