import { useMemo, useState } from 'react';
import requestContext from './request-context';
import { RequestService, TabInfo } from './request-service';

export function useCreateRequestContext() {
    const [currentTab, setCurrentTab] = useState<TabInfo>();
    const [tabs, setTabs] = useState<TabInfo[]>([]);

    const requestService = useMemo(() => {
        const service = new RequestService({
            setCurrentTab,
            setTabs,
        });
        service._refresh({
            currentTab,
            tabs,
        });
        return service;
    }, [currentTab, tabs]);

    return { requestContext, requestService };
}
