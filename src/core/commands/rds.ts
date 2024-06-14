import { invoke } from '@tauri-apps/api';
import { SendParams } from './common';
import { Request } from '../hooks/request-context/request';

export type RdsSendParams = SendParams & {
    clusterArn: string;
    database: string;
    query: string;
    secretArn: string;
};
export type RdsSendResult = string;
export type RdsRequest = Request<RdsSendParams, RdsSendResult>;

export async function rdsSend(params: RdsSendParams): Promise<RdsSendResult> {
    try {
        const response = await invoke<string>('rds_execute', params);
        return JSON.parse(response);
    } catch (error) {
        return `RDS error: ${error}`;
    }
}
