import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import { Request } from '../workspace-context/request';

type UseWorkspaceSaveActiveAsParams = {
    onError?: () => void;
    onSuccess?: () => void;
};

export function useWorkspaceSaveActiveAs({
    onError,
    onSuccess,
}: UseWorkspaceSaveActiveAsParams = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (filepath: string) => {
            const response = await invoke<string>(
                'post_workspace_save_active_as',
                { filepath },
            );

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
export type { UseWorkspaceSaveActiveAsParams };
