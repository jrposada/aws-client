import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { Request } from '../../types/request';

export function useActiveRequest() {
    return useQuery({
        queryKey: ['requests', 'active'],
        queryFn: async () => {
            const response = await invoke<string>('get_active_request');

            return JSON.parse(response) as Request;
        },
    });
}
