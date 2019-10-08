import { SNSEvent } from "aws-lambda";

export type Message = string | {
    toString(): string;
}

export const Message = (event: SNSEvent): Message => event.Records[ 0 ].Sns.Message;
