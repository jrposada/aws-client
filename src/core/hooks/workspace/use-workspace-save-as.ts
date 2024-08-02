import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import { Request } from '../workspace-context/request';

export function useWorkspaceSaveAs() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (filepath: string) => {
            const response = await invoke<string>('post_workspace_save_as', {
                filepath,
            });

            return JSON.parse(response) as Request[];
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['workspace'],
            });

            queryClient.invalidateQueries({
                queryKey: ['requests'],
            });
        },
    });
}
