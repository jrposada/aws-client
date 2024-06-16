import { invoke } from '@tauri-apps/api';
import {
    Request,
    RequestData,
    RequestResult,
} from '../hooks/request-context/request';

export type RdsSendParams = RequestData & {
    clusterArn: string;
    database: string;
    query: string;
    secretArn: string;
};
export type RdsSendResult = Record<string, string>[];
export type RdsRequest = Request<RdsSendParams, RdsSendResult>;

export async function rdsSend(
    params: RdsSendParams,
): Promise<RequestResult<RdsSendResult>> {
    try {
        const response = await invoke<string>('rds_execute', params);
        return {
            success: true,
            data: JSON.parse(response),
        };
    } catch {
        return { success: false };
    }
}
