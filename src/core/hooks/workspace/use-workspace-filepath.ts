import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';

export function useWorkspaceFilepath() {
    return useQuery({
        queryKey: ['workspace', 'filepath'],
        queryFn: async () => {
            return await invoke<string>('get_workspace_filepath');
        },
    });
}
