import { useMemo, useState } from 'react';
import requestContext from './request-context';
import { RequestService } from './request-service';
import { Request } from './request';

export function useCreateRequestContext() {
    const [currentRequest, setCurrentRequest] = useState<Request>();
    const [requests, setRequests] = useState<Request[]>([]);

    const requestService = useMemo(() => {
        const service = new RequestService({
            setCurrentRequest,
            setRequests,
        });
        service._refresh({
            currentRequest,
            requests,
        });
        return service;
    }, [currentRequest, requests]);

    return { requestContext, requestService };
}
