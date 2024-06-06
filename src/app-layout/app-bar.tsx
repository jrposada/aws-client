import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import { Toolbar, useTheme } from '@mui/material';
import { appWindow } from '@tauri-apps/api/window';
import { MouseEventHandler } from 'react';
import AppWindowButtons from './app-window-buttons';
import NewButton from './new-button';
import StyledAppBar from './styled/app-bar';
import AppBarIconButton from './styled/app-bar-icon-button';

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
                    sx={{
                        gap: 1,
                    }}
                    style={{
                        paddingRight: 0,
                    }}
                >
                    <AppBarIconButton
                        aria-label="open drawer"
                        color="inherit"
                        edge="start"
                        onClick={toggleDrawer}
                    >
                        {open ? <ChevronLeftIcon /> : <MenuIcon />}
                    </AppBarIconButton>

                    <NewButton />

                    <AppWindowButtons />
                </Toolbar>
            </StyledAppBar>
        </>
    );
};

export default AppBar;
1;
