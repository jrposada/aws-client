import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import { Request } from '../../types/request';

export function useOpenRequests() {
    return useQuery({
        queryKey: ['requests', 'open'],
        queryFn: async () => {
            return await invoke<Request[]>('get_open_requests');
        },
    });
}
