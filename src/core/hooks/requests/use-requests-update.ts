import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import useSnackbar from '../../../ui/snackbar/use-snackbar';
import { Request } from '../workspace-context/request';

type UseRequestsUpdateParams = {
    onError?: (message: string) => void;
    onSuccess?: () => void;
};

type UseRequestsUpdateMutationParams = {
    id: string,
    data: string,
}

export function useRequestsUpdate({ onError, onSuccess }: UseRequestsUpdateParams = {}) {
    const queryClient = useQueryClient();
    const { enqueueAutoHideSnackbar } = useSnackbar();

    return useMutation<Request, string, UseRequestsUpdateMutationParams, unknown>({
        mutationFn: async ({ id, data }) => {
            const response = await invoke<string>('put_requests', {
                id,
                title: data
            });

            return JSON.parse(response) as Request;
        },
        onError: (message) => {
            enqueueAutoHideSnackbar({
                message: `Could could update request. ${message}`,
                variant: 'error',
            });
            onError?.(message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['requests', 'open'],
            });
            queryClient.invalidateQueries({
                queryKey: ['requests', 'active'],
            });

            onSuccess?.();
        },
    });
}
