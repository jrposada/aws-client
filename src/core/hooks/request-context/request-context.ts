import { createContext } from 'react';
import { RequestService } from './request-service';

const requestContext = createContext<RequestService | null>(null);

export default requestContext;
