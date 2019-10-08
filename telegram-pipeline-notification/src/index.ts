import * as utils from "./utils";
import { APIGatewayProxyResult, Handler, SNSEvent } from "aws-lambda";

export const handler: Handler<SNSEvent, APIGatewayProxyResult> =
    async (event: SNSEvent): Promise<APIGatewayProxyResult> => {
        try {
            const env = utils.Environment();
            const message = utils.Message(event);
            const result = await utils.sendMessage(env, message);
            console.log(`Notification sent to ${result.chat.type} ${result.chat.title || result.chat.id}`);
            return {
                statusCode: 200,
                body: JSON.stringify(result),
            };
        } catch (error) {
            console.error(error);
            return {
                statusCode: 500,
                body: JSON.stringify("Internal Server Error"),
            };
        }
    };
