import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import { Request } from '../../types/request';

export function useRequests() {
    return useQuery({
        queryKey: ['requests'],
        queryFn: async () => {
            return await invoke<Request[]>('get_requests');
        },
    });
}
