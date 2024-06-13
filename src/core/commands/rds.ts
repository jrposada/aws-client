import { invoke } from '@tauri-apps/api';
import { SendParams } from './common';

export type RdsSendParams = SendParams & {};
export type RdsSendResult = string;

export async function rdsSend({
    profileName,
}: RdsSendParams): Promise<RdsSendResult> {
    try {
        return invoke<string>('rds_list', {
            profileName,
        });
    } catch (error) {
        return `RDS error: ${error}`;
    }
}
