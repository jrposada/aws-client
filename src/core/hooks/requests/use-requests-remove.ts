import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import useSnackbar from '../../../ui/snackbar/use-snackbar';
import { Request } from '../workspace-context/request';

type UseRequestsRemoveParams = {
    onError?: (message: string) => void;
    onSuccess?: () => void;
};

export function useRequestsRemove({ onError, onSuccess }: UseRequestsRemoveParams = {}) {
    const queryClient = useQueryClient();
    const { enqueueAutoHideSnackbar } = useSnackbar();

    return useMutation<Request[], string, string, unknown>({
        mutationFn: async (id: string) => {
            const response = await invoke<string>('delete_requests', {
                id,
            });

            return JSON.parse(response) as Request[];
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
