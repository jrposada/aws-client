import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import { Request } from '../workspace-context/request';

export function useActiveRequestUpdate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await invoke<string>('post_active_request', {
                id,
            });

            return JSON.parse(response) as Request[];
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['requests', 'active'],
            });
        },
    });
}
