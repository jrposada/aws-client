import { useEffect, useMemo, useState } from 'react';
import requestContext from './request-context';
import { RequestService } from './request-service';
import { Request } from './request';
import { invoke } from '@tauri-apps/api';

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

    useEffect(() => {
        invoke<string>('load_app_state').then((stateStr) => {
            setRequests(JSON.parse(stateStr));
        });
    }, []);

    return { requestContext, requestService };
}
