import { Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import DrawerItem, { DrawerItemProps } from './drawer-item';
import { useRequests } from '../core/hooks/requests/use-requests';
import { useActiveRequest } from '../core/hooks/requests/use-active-request';
import { useActiveRequestUpdate } from '../core/hooks/requests/use-active-request-update';

const DrawerItems: React.FunctionComponent = () => {
    const { data: requests } = useRequests();
    const { data: activeRequest } = useActiveRequest();
    const { mutate: setActiveRequest } = useActiveRequestUpdate();

    const [contextMenuRequestId, setContextMenuRequestId] = useState<string>();

    const [contextMenu, setContextMenu] = useState<{
        mouseY: number;
        mouseX: number;
    } | null>(null);

    const handleContextMenu: DrawerItemProps['onContextMenu'] = (id, event) => {
        setContextMenuRequestId(id);
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                      mouseX: event.clientX - 2,
                      mouseY: event.clientY - 4,
                  }
                : null,
        );
    };

    const handleClick: DrawerItemProps['onClick'] = (id, _event) => {
        setActiveRequest(id);
    };

    const handleClose = () => {
        setContextMenuRequestId(undefined);
        setContextMenu(null);
    };

    const handleRemove = () => {
        if (!contextMenuRequestId) return;

        console.log('TODO');
        // workspaceService.removeRequestById(contextMenuRequestId);
        handleClose();
    };

    return (
        <>
            {requests?.map(({ id, title }) => (
                <DrawerItem
                    id={id}
                    key={id}
                    onClick={handleClick}
                    onContextMenu={handleContextMenu}
                    selected={id === activeRequest?.id}
                    title={title}
                />
            ))}
            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
            >
                <MenuItem onClick={handleRemove}>Remove</MenuItem>
            </Menu>
        </>
    );
};
export default DrawerItems;
