import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import { Toolbar, Typography, useTheme } from '@mui/material';
import { appWindow } from '@tauri-apps/api/window';
import { t } from 'i18next';
import { MouseEventHandler } from 'react';
import StyledAppBar from './styled/app-bar';
import AppBarButton from './styled/app-bar-button';
import AppWindowButtons from './app-window-buttons';

type AppBarProps = {
    open: boolean;
    toggleDrawer: () => void;
};

const AppBar: React.FunctionComponent<AppBarProps> = ({
    open,
    toggleDrawer,
}) => {
    const theme = useTheme();

    const handleAppBarMouseDown: MouseEventHandler = () => {
        appWindow.startDragging();
    };

    return (
        <>
            {/* Dummy toolbar for dragging */}
            <Toolbar
                variant="dense"
                onMouseDown={handleAppBarMouseDown}
                sx={{
                    position: 'absolute',
                    width: 1,
                    zIndex: theme.zIndex.drawer,
                }}
            />
            <StyledAppBar
                position="absolute"
                open={open}
                sx={{
                    pointerEvents: 'none',
                }}
            >
                <Toolbar
                    variant="dense"
                    style={{
                        paddingRight: 0,
                    }}
                >
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

                    <AppWindowButtons />
                </Toolbar>
            </StyledAppBar>
        </>
    );
};

export default AppBar;
1;
