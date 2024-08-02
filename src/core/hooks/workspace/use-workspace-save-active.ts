import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import useSnackbar from '../../../ui/snackbar/use-snackbar';
import { Request } from '../../types/request';

type UseWorkspaceSaveActiveParams = {
    onError?: (message: string) => void;
    onSuccess?: () => void;
};

export function useWorkspaceSaveActive({
    onError,
    onSuccess,
}: UseWorkspaceSaveActiveParams = {}) {
    const queryClient = useQueryClient();
    const { enqueueAutoHideSnackbar } = useSnackbar();

    return useMutation<Request[], string, void, unknown>({
        mutationFn: async () => {
            const response = await invoke<string>('post_workspace_save_active');

            return JSON.parse(response) as Request[];
        },
        onError: (message) => {
            enqueueAutoHideSnackbar({
                message: `Could not save request. ${message}`,
                variant: 'error',
            });
            onError?.(message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['workspace'],
            });

            queryClient.invalidateQueries({
                queryKey: ['requests'],
            });

            onSuccess?.();
        },
    });
}
export type { UseWorkspaceSaveActiveParams };
