import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import { Request } from '../../types/request';

export function useRequests() {
    return useQuery({
        queryKey: ['requests'],
        queryFn: async () => {
            const response = await invoke<string>('get_open_requests');

            return JSON.parse(response) as Request[];
        },
    });
}
