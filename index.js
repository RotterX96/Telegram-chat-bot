const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options') // импортируем из файла options.js
const token = '1955558245:AAEtorvdsfyItukZgwNmVHZbc1BdZNw-ftU'

const bot = new TelegramApi(token, {polling: true})

// аналог базы данных с обьектами которые будут содержать как ключи id чата, а как значение загаданное ботом число
const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 8 до 9, а ты должен её угадать`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, `Отгадывай`, gameOptions)
}

const start = () => {
// команды бота
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра угадай цифру'}
    ])

    bot.on('message', async msg => {
        const text = msg.text; // получили текст
        const chatId = msg.chat.id; // получили айди

        // bot.sendMessage(chatId, `Ты написал мне ${text}`) // бот отвечает тем же
        if (text === '/start') {
            await bot.sendSticker(chatId, `https://tlgrm.ru/_/stickers/dc7/a36/dc7a3659-1457-4506-9294-0d28f529bb0a/11.webp`)
            return bot.sendMessage(chatId, `Добро пожаловать на мой телеграм канал`) // задать сообщение на команду старт
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, `Я тебя не понимаю, попробуй мои команды`)
    })

    bot.on('callback_query', msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
        // bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
        // console.log(msg)
    })
}
start()


