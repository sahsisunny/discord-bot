require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const { Client, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({
     intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
     ]
});

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
          message.reply(`${data.choices[0].text}`);
     } catch (error) {
          console.error(error);
     }
});
client.login(process.env.DISCORD_TOKEN);
app.listen(process.env.PORT, () => {
     console.log(`Discord bot running on PORT ${process.env.PORT}`);
});
