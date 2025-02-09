import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { t } from 'i18next';
import useSnackbar from '../../../ui/snackbar/use-snackbar';
import { Request } from '../../types/request';
import { RequestType } from '../../types/request-type';

type UseRequestsCreateParams = {
    onError?: (message: string) => void;
    onSuccess?: () => void;
};

export function useRequestsCreate({
    onError,
    onSuccess,
}: UseRequestsCreateParams = {}) {
    const queryClient = useQueryClient();
    const { enqueueAutoHideSnackbar } = useSnackbar();

    return useMutation<Request[], string, RequestType, unknown>({
        mutationFn: async (requestType: RequestType) => {
            const response = await invoke<string>('post_requests', {
                requestType,
                title: t('new-request-title', {
                    type: requestType.toUpperCase(),
                }),
            });

            return JSON.parse(response) as Request[];
        },
        onError: (message) => {
            enqueueAutoHideSnackbar({
                message: `Could could create request. ${message}`,
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
