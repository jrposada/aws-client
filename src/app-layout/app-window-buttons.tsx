import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CropSquareRoundedIcon from '@mui/icons-material/CropSquareRounded';
import FilterNoneRoundedIcon from '@mui/icons-material/FilterNoneRounded';
import HorizontalRuleRoundedIcon from '@mui/icons-material/HorizontalRuleRounded';
import { SvgIconTypeMap } from '@mui/material';
import { DefaultComponentProps } from '@mui/material/OverridableComponent';
import { appWindow } from '@tauri-apps/api/window';
import { FunctionComponent, MouseEventHandler, useState } from 'react';
import useSnackbar from '../ui/snackbar/use-snackbar';
import AppWindowButton, {
    AppWindowButtonProps,
} from './styled/app-window-button';
import { useWorkspaceSave } from '../core/hooks/workspace/use-workspace-save';

const closeOnErrorMs = 2000;

const buttonProps: Partial<AppWindowButtonProps> = {
    color: 'inherit',
};

const iconProps: DefaultComponentProps<SvgIconTypeMap<{}, 'svg'>> = {
    fontSize: 'small',
};

const AppWindowButtons: FunctionComponent = () => {
    const { enqueueAutoHideSnackbar } = useSnackbar();
    const { mutate: save } = useWorkspaceSave({
        onSuccess: () => {
            appWindow.close();
        },
        onError: () => {
            enqueueAutoHideSnackbar({
                message: `Auto save failed, app will close in ${closeOnErrorMs / 1000} seconds`,
                variant: 'error',
            });
            setTimeout(() => void appWindow.close(), closeOnErrorMs);
        },
    });

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
        save();
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
