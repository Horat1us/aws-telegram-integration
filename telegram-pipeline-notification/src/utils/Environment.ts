declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_API_KEY: string | undefined;
            CHAT_ID: string | undefined;
        }
    }
}

export interface Environment {
    botApiKey: string;
    chatId: string;
}

const botApiKeyRegEx = /^\d+:[\d\w_]+$/;
const chatIdRegEx = /^-?\d+$/;

export const Environment = (): Environment => {
    const { BOT_API_KEY: botApiKey, CHAT_ID: chatId } = process.env;
    if ("string" !== typeof botApiKey || !botApiKeyRegEx.test(botApiKey)) {
        throw new Error("Invalid Configuration: Bot API Key");
    }
    if ("string" !== typeof chatId || !chatIdRegEx.test(chatId)) {
        throw new Error(`Invalid Configuration: Chat ID`);
    }
    return Object.freeze({ botApiKey, chatId });
};
