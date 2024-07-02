import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import { Request, RequestType } from '../workspace-context/request';

export function useRequestsCreate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (requestType: RequestType) => {
            const response = await invoke<string>('post_requests', {
                requestType,
            });

            return JSON.parse(response) as Request[];
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['requests'],
            });
        },
    });
}
