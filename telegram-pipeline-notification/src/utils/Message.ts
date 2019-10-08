import { CodePipelineActionState, CodePipelineCloudWatchStageEvent, CodePipelineState, SNSEvent } from "aws-lambda";

export type Message = string | {
    toString(): string;
}

function getIcon(state: CodePipelineState): string {
    switch (state) {
        case "SUCCEEDED":
            return `✅`;
        case "FAILED":
            return "❗";
        case "CANCELED":
            return "🛑";
        default:
            return "ℹ️";
    }
}

export const Message = (event: SNSEvent): Message => {
    const pipelineEvent: CodePipelineCloudWatchStageEvent = JSON.parse(event.Records[ 0 ].Sns.Message);
    const { state, pipeline } = pipelineEvent.detail;
    return `${getIcon(state)} ${pipeline} ${state}`;
};
