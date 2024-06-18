import { Toolbar, Typography, useTheme } from '@mui/material';
import { appWindow } from '@tauri-apps/api/window';
import { MouseEventHandler } from 'react';
import { useWorkspaceService } from '../core/hooks/workspace-context/use-workspace-service';
import AppIconButton from './app-icon-button';
import AppWindowButtons from './app-window-buttons';
import NewButton from './new-button';
import StyledAppBar from './styled/app-bar';

type AppBarProps = {
    open: boolean;
};

const AppBar: React.FunctionComponent<AppBarProps> = ({ open }) => {
    const requestService = useWorkspaceService();
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
                    <AppIconButton />

                    <NewButton />

                    <Typography
                        sx={{
                            ml: 'auto',
                            mr: 'auto',
                        }}
                        variant="subtitle2"
                    >
                        {requestService.filename}
                    </Typography>

                    <AppWindowButtons />
                </Toolbar>
            </StyledAppBar>
        </>
    );
};

export default AppBar;
1;
