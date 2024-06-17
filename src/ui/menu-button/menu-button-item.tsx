import { MenuItem, MenuItemProps } from '@mui/material';
import { FunctionComponent, MouseEventHandler } from 'react';
import { useMenuButton } from './use-menu-button';

const MenuButtonItem: FunctionComponent<MenuItemProps> = ({
    onClick,
    children,
    ...restProps
}) => {
    const requestService = useMenuButton();

    const handleNew: MouseEventHandler<HTMLLIElement> = (event) => {
        onClick?.(event);
        requestService.close();
    };

    return (
        <>
            <MenuItem {...restProps} onClick={handleNew}>
                {children}
            </MenuItem>
        </>
    );
};

export default MenuButtonItem;
