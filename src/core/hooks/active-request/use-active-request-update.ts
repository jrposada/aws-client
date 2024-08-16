import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import useSnackbar from '../../../ui/snackbar/use-snackbar';

type UseActiveRequestUpdateParams = {
    onError?: (message: string) => void;
    onSuccess?: () => void;
};

export function useActiveRequestUpdate({
    onError,
    onSuccess,
}: UseActiveRequestUpdateParams = {}) {
    const queryClient = useQueryClient();
    const { enqueueAutoHideSnackbar } = useSnackbar();

    return useMutation<void, string, string, unknown>({
        mutationFn: async (id: string) => {
            await invoke<void>('post_active_request', {
                id,
            });
        },
        onError: (message) => {
            enqueueAutoHideSnackbar({
                message: `Could could not select request. ${message}`,
                variant: 'error',
            });
            onError?.(message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['requests'],
            });

            onSuccess?.();
        },
    });
}
