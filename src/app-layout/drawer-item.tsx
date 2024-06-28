import { ListItemButton, ListItemText } from '@mui/material';
import {
    MouseEvent,
    MouseEventHandler,
    NamedExoticComponent,
    memo,
} from 'react';

type DrawerItemProps = {
    id: string;
    onClick: (
        id: string,
        event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    ) => void;
    onContextMenu: (
        id: string,
        event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    ) => void;
    selected: boolean;
    title: string;
};

const DrawerItem: NamedExoticComponent<DrawerItemProps> = memo(
    ({ id, onClick, onContextMenu, selected, title }) => {
        const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
            onClick(id, event);
        };

        const handleContextMenu: MouseEventHandler<HTMLDivElement> = (
            event,
        ) => {
            onContextMenu(id, event);
        };

        return (
            <ListItemButton
                onClick={handleClick}
                onContextMenu={handleContextMenu}
                selected={selected}
            >
                <ListItemText primary={title} />
            </ListItemButton>
        );
    },
);

export default DrawerItem;
export type { DrawerItemProps };
