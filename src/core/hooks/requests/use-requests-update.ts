import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import useSnackbar from '../../../ui/snackbar/use-snackbar';
import { Request } from '../../types/request';

type UseRequestsUpdateParams = {
    onError?: (message: string) => void;
    onSuccess?: () => void;
};

type UseRequestsUpdateMutationParams = {
    id: string;
    title: string;
};

export function useRequestsUpdate({
    onError,
    onSuccess,
}: UseRequestsUpdateParams = {}) {
    const queryClient = useQueryClient();
    const { enqueueAutoHideSnackbar } = useSnackbar();

    return useMutation<
        Request,
        string,
        UseRequestsUpdateMutationParams,
        unknown
    >({
        mutationFn: async ({ id, title }) => {
            const response = await invoke<string>('put_requests', {
                id,
                title,
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
                queryKey: ['requests'],
            });

            onSuccess?.();
        },
    });
}
