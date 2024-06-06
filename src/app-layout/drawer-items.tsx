import HomeIcon from '@mui/icons-material/Home';
import { Menu, MenuItem } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { t } from 'i18next';
import { MouseEventHandler, useState } from 'react';

const DrawerItems: React.FunctionComponent = () => {
    const [contextMenu, setContextMenu] = useState<{
        mouseY: number;
        mouseX: number;
    } | null>(null);
    const [service, setService] = useState<string>();

    const handleContextMenu: MouseEventHandler<HTMLElement> = (event) => {
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

    const handleAuroraDbContextMenu: MouseEventHandler<HTMLElement> = (
        event,
    ) => {
        handleContextMenu(event);
        setService('aurora-db');
    };

    const handleDynamoDbContextMenu: MouseEventHandler<HTMLElement> = (
        event,
    ) => {
        handleContextMenu(event);
        setService('dynamo-db');
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    const handleNew = () => {
        console.log(service);
        setService(undefined);
        handleClose();
    };

    return (
        <>
            <ListItemButton onContextMenu={handleAuroraDbContextMenu}>
                <ListItemIcon>
                    <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={t('navigation.aurora-db')} />
            </ListItemButton>
            <ListItemButton onContextMenu={handleDynamoDbContextMenu}>
                <ListItemIcon>
                    <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={t('navigation.dynamo-db')} />
            </ListItemButton>
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
                <MenuItem onClick={handleNew}>New</MenuItem>
            </Menu>
        </>
    );
};
export default DrawerItems;
