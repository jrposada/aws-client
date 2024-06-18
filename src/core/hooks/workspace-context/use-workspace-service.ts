import { useContext } from 'react';
import workspaceContext from './workspace-context';

export function useWorkspaceService() {
    const service = useContext(workspaceContext);

    if (!service) {
        throw new Error('No workspace service provider');
    }

    return service;
}
