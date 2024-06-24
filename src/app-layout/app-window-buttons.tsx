import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CropSquareRoundedIcon from '@mui/icons-material/CropSquareRounded';
import FilterNoneRoundedIcon from '@mui/icons-material/FilterNoneRounded';
import HorizontalRuleRoundedIcon from '@mui/icons-material/HorizontalRuleRounded';
import { SvgIconTypeMap } from '@mui/material';
import { DefaultComponentProps } from '@mui/material/OverridableComponent';
import { appWindow } from '@tauri-apps/api/window';
import { FunctionComponent, MouseEventHandler, useState } from 'react';
import { useWorkspaceService } from '../core/hooks/workspace-context/use-workspace-service';
import useSnackbar from '../ui/snackbar/use-snackbar';
import AppWindowButton, {
    AppWindowButtonProps,
} from './styled/app-window-button';

const buttonProps: Partial<AppWindowButtonProps> = {
    color: 'inherit',
};

const iconProps: DefaultComponentProps<SvgIconTypeMap<{}, 'svg'>> = {
    fontSize: 'small',
};

const AppWindowButtons: FunctionComponent = () => {
    const { enqueueAutoHideSnackbar } = useSnackbar();
    const requestService = useWorkspaceService();

    const [isMaximized, setIsMaximized] = useState(false);
    const handleMinimize = () => {
        appWindow.minimize();
    };

    const handleUnMaximize = () => {
        appWindow.unmaximize();
        setIsMaximized(false);
    };

    const handleMaximize: MouseEventHandler = () => {
        appWindow.maximize();
        setIsMaximized(true);
    };

    const handleClose: MouseEventHandler = () => {
        requestService
            .save()
            .then(() => {
                appWindow.close();
            })
            .catch((error) => {
                console.log(error);
                enqueueAutoHideSnackbar({
                    message: 'Auto save failed',
                    variant: 'error',
                });
            });
    };
    return (
        <div
            style={{
                marginLeft: 'auto',
            }}
        >
            <AppWindowButton {...buttonProps} onClick={handleMinimize}>
                <HorizontalRuleRoundedIcon {...iconProps} />
            </AppWindowButton>

            {isMaximized && (
                <AppWindowButton {...buttonProps} onClick={handleUnMaximize}>
                    <FilterNoneRoundedIcon
                        {...iconProps}
                        style={{
                            transform: 'rotate(180deg)',
                        }}
                    />
                </AppWindowButton>
            )}
            {!isMaximized && (
                <AppWindowButton {...buttonProps} onClick={handleMaximize}>
                    <CropSquareRoundedIcon {...iconProps} />
                </AppWindowButton>
            )}

            <AppWindowButton onClick={handleClose} {...buttonProps}>
                <CloseRoundedIcon {...iconProps} />
            </AppWindowButton>
        </div>
    );
};

export default AppWindowButtons;
