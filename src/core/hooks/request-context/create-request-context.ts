import { useEffect, useMemo, useState } from 'react';
import requestContext from './request-context';
import { RequestService } from './request-service';
import { Request } from './request';

export function useCreateRequestContext() {
    const [currentRequest, setCurrentRequest] = useState<Request>();
    const [requests, setRequests] = useState<Request[]>([]);
    const [save, setSave] = useState(false);

    const requestService = useMemo(() => {
        const service = new RequestService({
            setCurrentRequest,
            setRequests,
        });
        service._refresh(
            {
                currentRequest,
                requests,
            },
            save,
        );
        return service;
    }, [currentRequest, requests, save]);

    /** Load app state on start up */
    useEffect(() => {
        requestService.load().then(() => setSave(true));
    }, []);

    return { requestContext, requestService };
}
