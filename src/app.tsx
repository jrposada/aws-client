import { FunctionComponent } from 'react';
import { AppLayout } from './app-layout';
import { useCreateRequestContext } from './core/hooks/request-context/create-request-context';

const App: FunctionComponent = () => {
    const { requestService, requestContext } = useCreateRequestContext();

    return (
        <requestContext.Provider value={requestService}>
            <AppLayout />;
        </requestContext.Provider>
    );
};

export default App;
