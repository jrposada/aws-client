import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import useSnackbar from '../../../ui/snackbar/use-snackbar';

type UseOpenRequestsRemoveParams = {
    onError?: (message: string) => void;
    onSuccess?: () => void;
};

export function useOpenRequestsRemove({
    onError,
    onSuccess,
}: UseOpenRequestsRemoveParams = {}) {
    const queryClient = useQueryClient();
    const { enqueueAutoHideSnackbar } = useSnackbar();

    return useMutation<void, string, string, unknown>({
        mutationFn: async (id: string) => {
            await invoke<void>('delete_open_requests', {
                id,
            });
        },
        onError: (message) => {
            enqueueAutoHideSnackbar({
                message: `Could close request. ${message}`,
                variant: 'error',
            });
            onError?.(message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['requests', 'active'],
            });

            queryClient.invalidateQueries({
                queryKey: ['requests', 'open'],
            });

            onSuccess?.();
        },
    });
}
