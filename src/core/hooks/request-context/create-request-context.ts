import { useEffect, useMemo, useState } from 'react';
import requestContext from './request-context';
import { RequestService, RequestServiceState } from './request-service';

const intervalMs = 1000 * 60 * 5; // 5 minutes

export function useCreateRequestContext() {
    const [state, setState] = useState<RequestServiceState>({
        currentRequest: undefined,
        filepath: undefined,
        requests: [],
    });
    const [save, setSave] = useState(false);

    const requestService = useMemo(() => {
        const service = new RequestService(setState);
        service._refresh(state);
        return service;
    }, [state, save]);

    /** Load app state on start up */
    useEffect(() => {
        if (save) {
            return;
        }

        requestService.load().then(() => setSave(true));
    }, [requestService, save]);

    /** Save every `intervalMs` */
    useEffect(() => {
        if (!save) {
            return;
        }

        const interval = setInterval(() => {
            requestService.save();
        }, intervalMs);

        return () => {
            clearInterval(interval);
        };
    }, [requestService]);

    return { requestContext, requestService };
}
