import { useEffect, useMemo, useState } from 'react';
import requestContext from './request-context';
import { RequestService } from './request-service';
import { Request } from './request';

const intervalMs = 1000 * 60 * 5; // 5 minutes

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
        if (save) {
            return;
        }

        requestService.load().then(() => setSave(true));
    }, [requestService, save]);

    /** Save every `intervalMs` */
    useEffect(() => {
        const interval = setInterval(() => {
            requestService.save();
        }, intervalMs);

        return () => {
            clearInterval(interval);
        };
    }, [requestService]);

    return { requestContext, requestService };
}
