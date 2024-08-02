import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import useSnackbar from '../../../ui/snackbar/use-snackbar';
import { Request } from '../../types/request';

type UseWorkspaceSaveAsParams = {
    onError?: (message: string) => void;
    onSuccess?: () => void;
};

export function useWorkspaceSaveAs({
    onError,
    onSuccess,
}: UseWorkspaceSaveAsParams = {}) {
    const queryClient = useQueryClient();
    const { enqueueAutoHideSnackbar } = useSnackbar();

    return useMutation<Request[], string, string, unknown>({
        mutationFn: async (filepath: string) => {
            const response = await invoke<string>('post_workspace_save_as', {
                filepath,
            });

            return JSON.parse(response) as Request[];
        },
        onError: (message) => {
            enqueueAutoHideSnackbar({
                message: `Could not save workspace. ${message}`,
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
