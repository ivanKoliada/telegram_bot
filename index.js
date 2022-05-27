const { gameOptions, againOptions } = require('./options');

const TelegramApi = require('node-telegram-bot-api')

const token = '5513683307:AAEGVgZHf5Fz-Qvx20FqqMlaciEmjFfG7hw'

const bot = new TelegramApi(token, { polling: true })

const chats = {};


const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `я загадаю цифру от 0-9, а ты угадывай`);
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, `отгадывай`, gameOptions);
}

function start() {
  bot.setMyCommands([
    {command: '/start', description: 'Приветствие'},
    {command: '/info', description: 'Инфа о пользователе'},
    {command: '/game', description: 'игра угадай цифру'},
  ])

  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    switch (text) {
      case '/start':
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/d57/6d1/d576d1b3-d2b5-40de-8c91-f254307bf4be/1.webp')
        return bot.sendMessage(chatId, `че ты, а? пес-${msg.from.first_name}`)
      case '/info':
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/d57/6d1/d576d1b3-d2b5-40de-8c91-f254307bf4be/2.webp')
        return bot.sendMessage(chatId, `имя - ${msg.from.first_name}, отзывается на пес`)
      case '/game':
        return startGame(chatId);

      default:
        return bot.sendMessage(chatId, `ты шо пьяный?`)
    }
  
  })
  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId);
    }

    if (data == chats[chatId]) {
      return await bot.sendMessage(chatId, `повезло, угадал, цифра: ${chats[chatId]}`, againOptions);
    } else {
      return await bot.sendMessage(chatId, `ненене, бот загадал цифру: ${chats[chatId]}`, againOptions);
    }
    
  })
}

start();