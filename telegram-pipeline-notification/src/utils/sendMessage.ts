import { Environment } from "./Environment";
import { Message } from "./Message";
import { sendRequest } from "./sendRequest";

export interface SendResult {
    message_id: number;
    chat: {
        id: number;
        title: string;
        type: string;
    };
    date: number;
    text: string;
}

export async function sendMessage(env: Environment, message: Message): Promise<SendResult> {
    const url = new URL(
        `/bot${encodeURIComponent(env.botApiKey)}/sendMessage`,
        'https://api.telegram.org/'
    );
    url.searchParams.append('chat_id', env.chatId);
    url.searchParams.append('text', message.toString());

    const response = await sendRequest<SendResult>(url);
    if (!response.ok) {
        throw new Error(`Telegram Error #${response.error_code}: ${response.description}`);
    }
    return response.result;
}
