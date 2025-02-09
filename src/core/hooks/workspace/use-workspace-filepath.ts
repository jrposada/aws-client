import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';

export function useWorkspaceFilepath() {
    return useQuery({
        queryKey: ['workspace', 'filepath'],
        queryFn: async () => {
            const response = await invoke<string>('get_workspace_filepath');

            return response;
        },
    });
}
