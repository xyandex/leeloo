import { Telegraf } from 'telegraf'

const BOT_TOKEN="5279943937:AAEJF7U4cMk0TGws5RFWck9va7dKkG7oSl4"
const CHAT_IDs = [-1001609896360, -1001771450965 ]
const CHAT_ID_admin = -1001637351601
const LUCKY_NUMBERS = [100,200,1000]

async function getChatMembersCount(bot, chat_id) {
  return bot.telegram.getChatMembersCount(chat_id)
   .then(resp => {
     // console.log('getChatMembersCount result:',resp)
     return resp
   })
   .catch(err => {
     console.log('get err')
     return 0
   })
}

async function main() {
  const tgbot = new Telegraf(BOT_TOKEN, {channelMode: true})
  await tgbot.launch()

  tgbot.on('message', async (ctx) => {
    //новый вступивший
    if (ctx.update.message.new_chat_member && CHAT_IDs.includes(ctx.update.message.chat.id)) {
      console.log({
  chat: ctx.update.message.chat.title,
  chat_id: ctx.update.message.chat.id,
  isNewUser: Object.keys(ctx.update.message).filter(e=>e=='new_chat_member').length>0,
  message: ctx.update.message.text,
  user: ctx.update.message.from,
        ctx:ctx.update.message
})
      const curCount = await getChatMembersCount(tgbot, ctx.update.message.chat.id)
      let userInfo = `@${ctx.update.message.new_chat_member.username}`
      if(!ctx.update.message.new_chat_member.username) userInfo = `${ctx.update.message.new_chat_member.first_name} ${ctx.update.message.new_chat_member.last_name}`
      // if(!ctx.update.message.new_chat_member.username) userInfo = `@${ctx.update.message.new_chat_member.username}`
      const mess = `❤️ Кол-во пользователей изменилось\nНомер: ${curCount}\nЧат: ${ctx.update.message.chat.title}\nПоследний вступил: ${userInfo}`
      await tgbot.telegram.sendMessage(CHAT_ID_admin, mess)

      if(LUCKY_NUMBERS.includes(curCount)) {
        await tgbot.telegram.sendMessage(CHAT_ID_admin, `❤ ЕЕЕ БОЙ\nВСТУПИЛ ${curCount} пользователь\n ${JSON.stringify(ctx.update.message.new_chat_member)}`)
      }
    //сообщение 🗽
    } else if (ctx.update.message.text=='🗽') {
      for(let e of CHAT_IDs) {
        const {title} = await tgbot.telegram.getChat(e)
        await tgbot.telegram.sendMessage(CHAT_ID_admin, `🗽 Чат: ${title}\nКол-во юзеров: ${await getChatMembersCount(tgbot,e)}\nКто запрашивает: @${ctx.update.message.from.username}`)
      }
      //сообщение инфо
    } else if (ctx.update.message.text=='инфо') {
      let chats_str = ''
      for(let e of CHAT_IDs) {
        const {title} = await tgbot.telegram.getChat(e)
        const qty = await getChatMembersCount(tgbot, ctx.update.message.chat.id)
        chats_str+=`${title} (${qty}чел)\n`
      }
      const {title, id} = await tgbot.telegram.getChat(CHAT_ID_admin)
      let admin_chat_str = `${title} (id:${id})`
        await tgbot.telegram.sendMessage(CHAT_ID_admin, `Чаты:\n${chats_str}\nСчастливые числа: ${LUCKY_NUMBERS}\nАдминский чат: ${admin_chat_str}`)

//иные случи
    } else {
      console.log('----not foiund action----')
      console.log(ctx.update.message);
      console.log('----/not foiund action----')
    }


  })


}

main()