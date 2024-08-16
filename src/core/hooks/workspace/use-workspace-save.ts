import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import useSnackbar from '../../../ui/snackbar/use-snackbar';

type UseWorkspaceSaveParams = {
    onError?: (message: string) => void;
    onSuccess?: () => void;
};

export function useWorkspaceSave({
    onError,
    onSuccess,
}: UseWorkspaceSaveParams = {}) {
    const queryClient = useQueryClient();
    const { enqueueAutoHideSnackbar } = useSnackbar();

    return useMutation<void, string, void, unknown>({
        mutationFn: async () => {
            await invoke<void>('post_workspace_save');
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
export type { UseWorkspaceSaveParams };
