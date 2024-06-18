import { createContext } from 'react';
import { WorkspaceService } from './workspace-service';

const workspaceContext = createContext<WorkspaceService | null>(null);

export default workspaceContext;
