import { describe, expect, it, vi } from 'vitest';

vi.mock('./app-layout', () => ({ AppLayout: () => {} }));
vi.mock('./core/hooks/workspace-context/create-workspace-context', () => ({
    useCreateWorkspaceContext: () => ({
        workspaceContext: { Provider: () => <></> },
    }),
}));

import { render } from '@testing-library/react';
import App from './app';

describe('Given <App/>', () => {
    it('then it renders', () => {
        expect(() => render(<App />)).not.toThrow();
    });
});
