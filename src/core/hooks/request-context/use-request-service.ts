import { useContext } from 'react';
import requestContext from './request-context';

export function useRequestService() {
    const service = useContext(requestContext);

    if (!service) {
        throw new Error('No request service provider');
    }

    return service;
}
