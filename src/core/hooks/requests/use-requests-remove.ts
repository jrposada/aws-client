import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import useSnackbar from '../../../ui/snackbar/use-snackbar';

type UseRequestsRemoveParams = {
    onError?: (message: string) => void;
    onSuccess?: () => void;
};

export function useRequestsRemove({
    onError,
    onSuccess,
}: UseRequestsRemoveParams = {}) {
    const queryClient = useQueryClient();
    const { enqueueAutoHideSnackbar } = useSnackbar();

    return useMutation<void, string, string, unknown>({
        mutationFn: async (id: string) => {
            await invoke<void>('delete_requests', {
                id,
            });
        },
        onError: (message) => {
            enqueueAutoHideSnackbar({
                message: `Could could remove request. ${message}`,
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
