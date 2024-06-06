import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CropSquareRoundedIcon from '@mui/icons-material/CropSquareRounded';
import FilterNoneRoundedIcon from '@mui/icons-material/FilterNoneRounded';
import HorizontalRuleRoundedIcon from '@mui/icons-material/HorizontalRuleRounded';
import { appWindow } from '@tauri-apps/api/window';
import { FunctionComponent, MouseEventHandler, useState } from 'react';
import AppWindowButton from './styled/app-window-button';

const AppWindowButtons: FunctionComponent = () => {
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
        appWindow.close();
    };
    return (
        <>
            <AppWindowButton color="inherit" onClick={handleMinimize}>
                <HorizontalRuleRoundedIcon fontSize="small" />
            </AppWindowButton>

            {isMaximized && (
                <AppWindowButton color="inherit" onClick={handleUnMaximize}>
                    <FilterNoneRoundedIcon
                        fontSize="small"
                        style={{
                            transform: 'rotate(180deg)',
                        }}
                    />
                </AppWindowButton>
            )}
            {!isMaximized && (
                <AppWindowButton color="inherit" onClick={handleMaximize}>
                    <CropSquareRoundedIcon fontSize="small" />
                </AppWindowButton>
            )}

            <AppWindowButton color="inherit" onClick={handleClose}>
                <CloseRoundedIcon fontSize="small" />
            </AppWindowButton>
        </>
    );
};

export default AppWindowButtons;
