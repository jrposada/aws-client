import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import useSnackbar from '../../../ui/snackbar/use-snackbar';

type UseWorkspaceSaveAsParams = {
    onError?: (message: string) => void;
    onSuccess?: () => void;
};

export function useWorkspaceSaveAs({
    onError,
    onSuccess,
}: UseWorkspaceSaveAsParams = {}) {
    const queryClient = useQueryClient();
    const { enqueueAutoHideSnackbar } = useSnackbar();

    return useMutation<void, string, string, unknown>({
        mutationFn: async (filepath: string) => {
            await invoke<void>('post_workspace_save_as', {
                filepath,
            });
        },
        onError: (message) => {
            enqueueAutoHideSnackbar({
                message: `Could not save workspace. ${message}`,
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
