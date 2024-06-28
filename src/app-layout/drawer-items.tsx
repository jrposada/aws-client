import { Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useWorkspaceService } from '../core/hooks/workspace-context/use-workspace-service';
import DrawerItem, { DrawerItemProps } from './drawer-item';

const DrawerItems: React.FunctionComponent = () => {
    const workspaceService = useWorkspaceService();
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
        workspaceService.setCurrentRequestById(id);
    };

    const handleClose = () => {
        setContextMenuRequestId(undefined);
        setContextMenu(null);
    };

    const handleRemove = () => {
        if (!contextMenuRequestId) return;

        workspaceService.removeRequestById(contextMenuRequestId);
        handleClose();
    };

    return (
        <>
            {workspaceService.requests.map(({ id, title }) => (
                <DrawerItem
                    id={id}
                    key={id}
                    onClick={handleClick}
                    onContextMenu={handleContextMenu}
                    selected={id === workspaceService.currentRequest?.id}
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
