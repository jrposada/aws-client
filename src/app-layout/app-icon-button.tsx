import MenuIcon from '@mui/icons-material/Menu';
import { MenuItem } from '@mui/material';
import { t } from 'i18next';
import { FunctionComponent, MouseEventHandler, useRef } from 'react';
import MenuButton from '../ui/menu-button/menu-button';
import { MenuButtonService } from '../ui/menu-button/menu-button-service';
import AppBarIconButton from './styled/app-bar-icon-button';
import { useRequestService } from '../core/hooks/request-context/use-request-service';

const AppIconButton: FunctionComponent = () => {
    const menuButtonService = useRef<MenuButtonService>(null);
    const requestService = useRequestService();

    const handleSaveAs: MouseEventHandler<HTMLLIElement> = () => {
        requestService.saveAs();
    };

    return (
        <>
            <AppBarIconButton
                aria-label="open drawer"
                color="inherit"
                edge="start"
                onClick={menuButtonService.current?.handleOpen}
            >
                <MenuIcon />
            </AppBarIconButton>
            <MenuButton ref={menuButtonService}>
                <MenuItem onClick={handleSaveAs}>{t('save-as')}</MenuItem>
            </MenuButton>
        </>
    );
};

export default AppIconButton;
