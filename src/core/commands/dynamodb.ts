import { invoke } from '@tauri-apps/api';
import { SendParams } from './common';

export type DynamodbSendParams = SendParams & {};
export type DynamodbSendResult = string;

export async function dynamodbSend({
    profileName,
}: DynamodbSendParams): Promise<DynamodbSendResult> {
    try {
        return await invoke<string>('dynamodb_list', {
            profileName,
        });
    } catch (error) {
        return `DynamoDB error: ${error}`;
    }
}
