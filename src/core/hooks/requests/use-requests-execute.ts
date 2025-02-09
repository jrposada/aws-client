import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import useSnackbar from '../../../ui/snackbar/use-snackbar';

type UseRequestsExecuteParams = {
    onError?: (message: string) => void;
    onSuccess?: () => void;
};

type UseRequestsExecuteMutationParams = {
    id: string;
};

export function useRequestsExecute({
    onError,
    onSuccess,
}: UseRequestsExecuteParams = {}) {
    const queryClient = useQueryClient();
    const { enqueueAutoHideSnackbar } = useSnackbar();

    return useMutation<void, string, UseRequestsExecuteMutationParams, unknown>(
        {
            mutationFn: async ({ id }) => {
                void (await invoke<string>('post_requests_execute', {
                    id,
                }));
            },
            onError: (message) => {
                enqueueAutoHideSnackbar({
                    message: `Could could Execute request. ${message}`,
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
        },
    );
}
