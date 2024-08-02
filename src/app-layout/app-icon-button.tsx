import MenuIcon from '@mui/icons-material/Menu';
import { Divider } from '@mui/material';
import { t } from 'i18next';
import { FunctionComponent, MouseEventHandler, useRef } from 'react';
import { useWorkspaceFilepath } from '../core/hooks/workspace/use-workspace-filepath';
import { useWorkspaceSave } from '../core/hooks/workspace/use-workspace-save';
import { useWorkspaceSaveAs } from '../core/hooks/workspace/use-workspace-save-as';
import { saveAsDialog } from '../core/utils/system-dialog';
import MenuButton from '../ui/menu-button/menu-button';
import MenuButtonItem from '../ui/menu-button/menu-button-item';
import { MenuButtonService } from '../ui/menu-button/menu-button-service';
import AppBarIconButton from './styled/app-bar-icon-button';

const AppIconButton: FunctionComponent = () => {
    const { data: filepath } = useWorkspaceFilepath();
    const { mutate: save } = useWorkspaceSave();
    const { mutate: saveAs } = useWorkspaceSaveAs();
    const menuButtonService = useRef<MenuButtonService>(null);

    const handleOpen: MouseEventHandler<HTMLLIElement> = () => {
        // requestService.openWorkspace();
        console.log('TODO open');
    };

    const handleSave: MouseEventHandler<HTMLLIElement> = async () => {
        if (filepath) {
            save();
        } else {
            const filepath = await saveAsDialog();
            if (filepath) {
                saveAs(filepath);
            }
        }
    };

    const handleSaveAs: MouseEventHandler<HTMLLIElement> = async () => {
        const filepath = await saveAsDialog();
        if (filepath) {
            saveAs(filepath);
        }
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
