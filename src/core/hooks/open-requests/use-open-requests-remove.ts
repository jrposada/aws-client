import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import useSnackbar from '../../../ui/snackbar/use-snackbar';
import { Request } from '../../types/request';

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

    return useMutation<Request[], string, string, unknown>({
        mutationFn: async (id: string) => {
            const response = await invoke<string>('delete_open_requests', {
                id,
            });

            return JSON.parse(response) as Request[];
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
                queryKey: ['requests', 'open'],
            });

            onSuccess?.();
        },
    });
}
