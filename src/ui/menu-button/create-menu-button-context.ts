import { useMemo, useState } from 'react';
import menuButtonContext from './menu-button-context';
import { ContextMenu, MenuButtonService } from './menu-button-service';

export function useCreateMenuButtonContext() {
    const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);

    const menuButtonService = useMemo(() => {
        const service = new MenuButtonService(setContextMenu);
        service._refresh(contextMenu);
        return service;
    }, [contextMenu]);

    return { menuButtonContext, menuButtonService };
}
