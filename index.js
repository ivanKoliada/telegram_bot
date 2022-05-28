const { gameOptions, againOptions } = require('./options');

const TelegramApi = require('node-telegram-bot-api')

const token = ''

const bot = new TelegramApi(token, { polling: true })

const chats = {};


const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Я загадаю цифру от 0-9, а ты угадывай`);
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, `Отгадывай`, gameOptions);
}

function start() {
  bot.setMyCommands([
    {command: '/start', description: 'Greeting'},
    {command: '/game', description: 'The number game'},
  ])

  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    switch (text) {
      case '/start':
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/d57/6d1/d576d1b3-d2b5-40de-8c91-f254307bf4be/1.webp')
        return bot.sendMessage(chatId, `Hey, what's up ${msg.from.first_name}`)
      case '/game':
        return startGame(chatId);

      default:
        return bot.sendMessage(chatId, `This command not found`)
    }
  
  })
  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId);
    }

    if (data == chats[chatId]) {
      return await bot.sendMessage(chatId, `success`, againOptions);
    } else {
      return await bot.sendMessage(chatId, `fail, number is ${chats[chatId]}, try again`, againOptions);
    }
    
  })
}

start();