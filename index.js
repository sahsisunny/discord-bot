require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

// Prepare to connect to Discord API
const client = new Client({
     intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
     ]
});

// Prepare to connect to OpenAI API
const configuration = new Configuration({
     organization:
          process.env.OPENAI_ORG,
     apiKey: process.env.OPENAI_KEY
});
const openai = new OpenAIApi(configuration);

client.on('messageCreate', async function (message) {
     try {
          if (message.author.bot) return;
          console.log(message.content);
          // message.reply(`You said: ${message.content}`);


          const url = 'https://api.openai.com/v1/completions';
          const objBody = {
               model: "text-davinci-003",
               prompt: `${message.content}`,
               max_tokens: 800,
               temperature: 0,
          };
          const gptResponse = await fetch(url, {

               method: 'POST',
               headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENAI_KEY}`
               },
               body: JSON.stringify(objBody)
          })
          const data = await gptResponse.json();
          // console.log("G-Res : ", gptResponse);
          // console.log("Data : ", data);
          message.reply(`${data.choices[0].text}`);
          console.log(data.choices[0].text);
     } catch (error) {
          console.error(error);
     }
});

// Log the bot into Discord
client.login(process.env.DISCORD_TOKEN);
console.log('ChatGPT Bot is online on Discord');