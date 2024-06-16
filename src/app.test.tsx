import { describe, expect, it, vi } from 'vitest';

vi.mock('./app-layout', () => ({ AppLayout: () => {} }));
vi.mock('./core/hooks/request-context/create-request-context', () => ({
    useCreateRequestContext: () => ({
        requestContext: { Provider: () => <></> },
    }),
}));

import { render } from '@testing-library/react';
import App from './app';

describe('Given <App/>', () => {
    it('then it renders', () => {
        expect(() => render(<App />)).not.toThrow();
    });
});
