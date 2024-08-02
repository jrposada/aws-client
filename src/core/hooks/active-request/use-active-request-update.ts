import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import useSnackbar from '../../../ui/snackbar/use-snackbar';
import { Request } from '../workspace-context/request';

type UseActiveRequestUpdateParams = {
    onError?: (message: string) => void;
    onSuccess?: () => void;
};

export function useActiveRequestUpdate({ onError, onSuccess }: UseActiveRequestUpdateParams = {}) {
    const queryClient = useQueryClient();
    const { enqueueAutoHideSnackbar } = useSnackbar();

    return useMutation<Request[], string, string, unknown>({
        mutationFn: async (id: string) => {
            const response = await invoke<string>('post_active_request', {
                id,
            });

            return JSON.parse(response) as Request[];
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
                queryKey: ['requests', 'open'],
            });

            queryClient.invalidateQueries({
                queryKey: ['requests', 'active'],
            });

            onSuccess?.();
        },
    });
}
