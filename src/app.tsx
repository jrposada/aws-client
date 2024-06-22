import { FunctionComponent } from 'react';
import { AppLayout } from './app-layout';
import { useCreateWorkspaceContext } from './core/hooks/workspace-context/create-workspace-context';

const App: FunctionComponent = () => {
    const { workspaceService, workspaceContext } = useCreateWorkspaceContext();

    return (
        <workspaceContext.Provider value={workspaceService}>
            <AppLayout />
        </workspaceContext.Provider>
    );
};

export default App;
