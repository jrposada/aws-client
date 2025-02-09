import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import useSnackbar from '../../../ui/snackbar/use-snackbar';
import { RequestData } from '../../types/request-data';
import { RequestType } from '../../types/request-type';

type UseRequestsUpdateParams = {
    onError?: (message: string) => void;
    onSuccess?: () => void;
};

type UseRequestsUpdateMutationParams<
    TRequestType extends RequestType = RequestType,
> = {
    id: string;
    title: string;
    data?: RequestData<TRequestType>;
};

export function useRequestsUpdate<
    TRequestType extends RequestType = RequestType,
>({ onError, onSuccess }: UseRequestsUpdateParams = {}) {
    const queryClient = useQueryClient();
    const { enqueueAutoHideSnackbar } = useSnackbar();

    return useMutation<
        void,
        string,
        UseRequestsUpdateMutationParams<TRequestType>,
        unknown
    >({
        mutationFn: async ({ id, title, data }) => {
            await invoke<string>('put_requests', {
                id,
                title,
                data: JSON.stringify(data),
            });
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
