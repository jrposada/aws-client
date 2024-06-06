import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CropSquareRoundedIcon from '@mui/icons-material/CropSquareRounded';
import FilterNoneRoundedIcon from '@mui/icons-material/FilterNoneRounded';
import HorizontalRuleRoundedIcon from '@mui/icons-material/HorizontalRuleRounded';
import MenuIcon from '@mui/icons-material/Menu';
import { Toolbar, Typography, useTheme } from '@mui/material';
import { appWindow } from '@tauri-apps/api/window';
import { t } from 'i18next';
import { MouseEventHandler, useState } from 'react';
import StyledAppBar from './styled/app-bar';
import AppBarButton from './styled/app-bar-button';

type AppBarProps = {
    open: boolean;
    toggleDrawer: () => void;
};

const AppBar: React.FunctionComponent<AppBarProps> = ({
    open,
    toggleDrawer,
}) => {
    const theme = useTheme();
    const [isMaximized, setIsMaximized] = useState(false);

    const handleAppBarMouseDown: MouseEventHandler = () => {
        appWindow.startDragging();
    };

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
            {/* Dummy toolbar for dragging */}
            <Toolbar
                variant="dense"
                onMouseDown={handleAppBarMouseDown}
                sx={{
                    zIndex: 'zIndex.drawer',
                }}
                style={{
                    position: 'absolute',
                    width: '100%',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    zIndex: theme.zIndex.drawer,
                }}
            />
            <StyledAppBar
                position="absolute"
                open={open}
                style={{
                    pointerEvents: 'none',
                }}
            >
                <Toolbar variant="dense">
                    <AppBarButton
                        aria-label="open drawer"
                        color="inherit"
                        edge="start"
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: '36px',
                        }}
                    >
                        {open ? <ChevronLeftIcon /> : <MenuIcon />}
                    </AppBarButton>

                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        sx={{ flexGrow: 1 }}
                    >
                        {t('home')}
                    </Typography>

                    <AppBarButton color="inherit" onClick={handleMinimize}>
                        <HorizontalRuleRoundedIcon />
                    </AppBarButton>

                    {isMaximized && (
                        <AppBarButton
                            color="inherit"
                            onClick={handleUnMaximize}
                        >
                            <FilterNoneRoundedIcon
                                style={{
                                    transform: 'rotate(180deg)',
                                }}
                            />
                        </AppBarButton>
                    )}
                    {!isMaximized && (
                        <AppBarButton color="inherit" onClick={handleMaximize}>
                            <CropSquareRoundedIcon />
                        </AppBarButton>
                    )}

                    <AppBarButton color="inherit" onClick={handleClose}>
                        <CloseRoundedIcon />
                    </AppBarButton>
                </Toolbar>
            </StyledAppBar>
        </>
    );
};

export default AppBar;
1;
