import { Toolbar, Typography, useTheme } from '@mui/material';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { MouseEventHandler, useMemo } from 'react';
import { useWorkspaceFilepath } from '../core/hooks/workspace/use-workspace-filepath';
import AppIconButton from './app-icon-button';
import AppWindowButtons from './app-window-buttons';
import NewButton from './new-button';
import StyledAppBar from './styled/app-bar';

const appWindow = getCurrentWebviewWindow();

type AppBarProps = {
    open: boolean;
};

const AppBar: React.FunctionComponent<AppBarProps> = ({ open }) => {
    const { data: filepath } = useWorkspaceFilepath();

    const theme = useTheme();

    const filename = useMemo(() => {
        const filenameWithExtension = filepath
            ?.split('/')
            .pop()
            ?.split('\\')
            .pop();

        return filenameWithExtension?.substring(
            0,
            filenameWithExtension.lastIndexOf('.'),
        );
    }, [filepath]);

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
                        {filename}
                    </Typography>

                    <AppWindowButtons />
                </Toolbar>
            </StyledAppBar>
        </>
    );
};

export default AppBar;
