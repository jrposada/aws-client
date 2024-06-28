import MenuIcon from '@mui/icons-material/Menu';
import { Divider } from '@mui/material';
import { t } from 'i18next';
import { FunctionComponent, MouseEventHandler, useRef } from 'react';
import { useWorkspaceService } from '../core/hooks/workspace-context/use-workspace-service';
import MenuButton from '../ui/menu-button/menu-button';
import MenuButtonItem from '../ui/menu-button/menu-button-item';
import { MenuButtonService } from '../ui/menu-button/menu-button-service';
import AppBarIconButton from './styled/app-bar-icon-button';

const AppIconButton: FunctionComponent = () => {
    const menuButtonService = useRef<MenuButtonService>(null);
    const requestService = useWorkspaceService();

    const handleOpen: MouseEventHandler<HTMLLIElement> = () => {
        requestService.openWorkspace();
    };

    const handleSave: MouseEventHandler<HTMLLIElement> = () => {
        if (requestService.filepath) {
            requestService.save(requestService.filepath);
        } else {
            requestService.saveAs();
        }
    };

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
                {/* <MenuButtonItem onClick={handleSaveAs}>{t('new')}</MenuButtonItem> */}
                <MenuButtonItem onClick={handleOpen}>
                    {t('open')}
                </MenuButtonItem>
                <Divider />
                <MenuButtonItem onClick={handleSave}>
                    {t('save')}
                </MenuButtonItem>
                <MenuButtonItem onClick={handleSaveAs}>
                    {t('save-as')}
                </MenuButtonItem>
            </MenuButton>
        </>
    );
};

export default AppIconButton;
