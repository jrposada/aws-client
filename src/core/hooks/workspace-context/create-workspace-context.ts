import { useEffect, useMemo, useState } from 'react';
import workspaceContext from './workspace-context';
import {
    DEFAULT_STATE,
    WorkspaceService,
    WorkspaceServiceState,
} from './workspace-service';

const intervalMs = 1000 * 60 * 5; // 5 minutes

export function useCreateWorkspaceContext() {
    const [savedState, setSavedState] =
        useState<WorkspaceServiceState>(DEFAULT_STATE);

    const [state, setState] = useState<WorkspaceServiceState>(DEFAULT_STATE);
    const [save, setSave] = useState(false);

    const workspaceService = useMemo(() => {
        const service = new WorkspaceService({
            savedState: setSavedState,
            state: setState,
        });
        service._refresh(state, savedState);
        return service;
    }, [state, save]);

    /** Load app state on start up */
    useEffect(() => {
        if (save) {
            return;
        }

        workspaceService.load().then(() => setSave(true));
    }, [workspaceService, save]);

    /** Save every `intervalMs` */
    useEffect(() => {
        if (!save) {
            return;
        }

        const interval = setInterval(() => {
            workspaceService.save();
        }, intervalMs);

        return () => {
            clearInterval(interval);
        };
    }, [workspaceService]);

    return { workspaceContext, workspaceService };
}
