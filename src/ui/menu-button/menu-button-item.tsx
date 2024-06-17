import { MenuItem, MenuItemProps } from '@mui/material';
import { FunctionComponent, MouseEventHandler } from 'react';
import { useMenuButton } from './use-menu-button';

const MenuButtonItem: FunctionComponent<MenuItemProps> = ({
    onClick,
    children,
    ...restProps
}) => {
    const requestService = useMenuButton();

    const handleClick: MouseEventHandler<HTMLLIElement> = (event) => {
        onClick?.(event);
        requestService.close();
    };

    return (
        <>
            <MenuItem {...restProps} onClick={handleClick}>
                {children}
            </MenuItem>
        </>
    );
};

export default MenuButtonItem;
