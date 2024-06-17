import { createContext } from 'react';
import { MenuButtonService } from './menu-button-service';

const requestContext = createContext<MenuButtonService | null>(null);

export default requestContext;
