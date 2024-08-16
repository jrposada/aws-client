import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import { Request } from '../../types/request';

export function useActiveRequest() {
    return useQuery({
        queryKey: ['requests', 'active'],
        queryFn: async () => {
            return await invoke<Request | null>('get_active_request');
        },
    });
}
