'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var https = require('https');

const botApiKeyRegEx = /^\d+:[\d\w_]+$/;
const chatIdRegEx = /^-?\d+$/;
const Environment = () => {
    const { BOT_API_KEY: botApiKey, CHAT_ID: chatId } = process.env;
    if ("string" !== typeof botApiKey || !botApiKeyRegEx.test(botApiKey)) {
        throw new Error("Invalid Configuration: Bot API Key");
    }
    if ("string" !== typeof chatId || !chatIdRegEx.test(chatId)) {
        throw new Error(`Invalid Configuration: Chat ID`);
    }
    return Object.freeze({ botApiKey, chatId });
};

const Message = (event) => event.Records[0].Sns.Message;

const isResponse = (response) => ("ok" in response)
    && (("result" in response)
        || ("description" in response));
async function sendRequest(url) {
    const body = await new Promise((resolve, reject) => {
        const req = https.request(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
        req.end();
    });
    const response = JSON.parse(body);
    if (!isResponse(response)) {
        throw new Error(`Invalid Response: ${body}`);
    }
    return response;
}

async function sendMessage(env, message) {
    const url = new URL(`/bot${encodeURIComponent(env.botApiKey)}/sendMessage`, 'https://api.telegram.org/');
    url.searchParams.append('chat_id', env.chatId);
    url.searchParams.append('text', message.toString());
    const response = await sendRequest(url);
    if (!response.ok) {
        throw new Error(`Telegram Error #${response.error_code}: ${response.description}`);
    }
    return response.result;
}

const handler = async (event) => {
    try {
        const env = Environment();
        const message = Message(event);
        const result = await sendMessage(env, message);
        console.log(`Notification sent to ${result.chat.type} ${result.chat.title || result.chat.id}`);
        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    }
    catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify("Internal Server Error"),
        };
    }
};

exports.handler = handler;
