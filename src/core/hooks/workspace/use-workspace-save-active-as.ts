import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import useSnackbar from '../../../ui/snackbar/use-snackbar';

type UseWorkspaceSaveActiveAsParams = {
    onError?: (message: string) => void;
    onSuccess?: () => void;
};

export function useWorkspaceSaveActiveAs({
    onError,
    onSuccess,
}: UseWorkspaceSaveActiveAsParams = {}) {
    const queryClient = useQueryClient();
    const { enqueueAutoHideSnackbar } = useSnackbar();

    return useMutation<void, string, string, unknown>({
        mutationFn: async (filepath: string) => {
            await invoke<string>(
                'post_workspace_save_active_as',
                { filepath },
            );
        },
        onError: (message) => {
            enqueueAutoHideSnackbar({
                message: `Could not save request. ${message}`,
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

            enqueueAutoHideSnackbar({
                message: 'Requests saved.',
                variant: 'success',
            });
            onSuccess?.();
        },
    });
}
export type { UseWorkspaceSaveActiveAsParams };
