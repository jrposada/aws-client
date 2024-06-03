import { createRootRoute } from '@tanstack/react-router';
import App from './app';

export const rootRoute = createRootRoute({
    component: () => (
        <>
            <App />
        </>
    ),
});
