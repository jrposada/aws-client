import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import { Request } from '../workspace-context/request';

type UseWorkspaceSaveParams = {
    onError?: () => void;
    onSuccess?: () => void;
};

export function useWorkspaceSave({
    onError,
    onSuccess,
}: UseWorkspaceSaveParams = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await invoke<string>('post_workspace_save');

            return JSON.parse(response) as Request[];
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['workspace'],
            });

            queryClient.invalidateQueries({
                queryKey: ['requests'],
            });

            onSuccess?.();
        },
        onError: () => {
            onError?.();
        },
    });
}
export type { UseWorkspaceSaveParams };
