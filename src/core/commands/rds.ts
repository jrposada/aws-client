import { invoke } from '@tauri-apps/api';

export function send() {
    invoke<string>('rds_list', {
        profileName: 'aws-client-dev',
    })
        // `invoke` returns a Promise
        .then((response) => console.log(response))
        .catch((error) => console.error('RDS error', error));
}
