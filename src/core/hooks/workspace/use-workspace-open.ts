import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import useSnackbar from '../../../ui/snackbar/use-snackbar';

type UseWorkspaceOpenParams = {
    onError?: (message: string) => void;
    onSuccess?: () => void;
};

export function useWorkspaceOpen({
    onError,
    onSuccess,
}: UseWorkspaceOpenParams = {}) {
    const queryClient = useQueryClient();
    const { enqueueAutoHideSnackbar } = useSnackbar();

    return useMutation<void, string, string, unknown>({
        mutationFn: async (filepath: string) => {
            await invoke<string>('post_workspace_open', {
                filepath,
            });
        },
        onError: (message) => {
            enqueueAutoHideSnackbar({
                message: `Could not open workspace. ${message}`,
                variant: 'error',
            });
            onError?.(message);
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
    });
}
export type { UseWorkspaceOpenParams };
