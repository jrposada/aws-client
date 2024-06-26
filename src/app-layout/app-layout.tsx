import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Box, Divider, List, Toolbar } from '@mui/material';
import { Outlet } from '@tanstack/react-router';
import { Suspense, lazy } from 'react';
import { useLocalStorage } from '../core/hooks/use-local-storage/use-local-storage';
import AppBar from './app-bar';
import DrawerItems from './drawer-items';
import AppDrawer from './styled/app-drawer';

// Only load router dev tools in development mode.
const TanStackRouterDevtools =
    process.env.NODE_ENV === 'production'
        ? () => null
        : lazy(() =>
              import('@tanstack/router-devtools').then((res) => ({
                  default: res.TanStackRouterDevtools,
              })),
          );

const AppLayout: React.FunctionComponent = () => {
    const [open, setOpen] = useLocalStorage('navigation-menu:open', true);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar open={open} />

            <AppDrawer variant="permanent" open={open}>
                {/* Offset drawer by app header size */}
                <Toolbar variant="dense"></Toolbar>
                {/* Align with request tabs toolbar */}
                <Toolbar
                    variant="dense"
                    sx={{
                        height: '2rem',
                        minHeight: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        px: [2],
                    }}
                >
                    <ChevronLeftIcon
                        onClick={toggleDrawer}
                        role="button"
                        style={{
                            transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
                        }}
                    />
                </Toolbar>
                <Divider />
                <List>
                    <DrawerItems />
                </List>
            </AppDrawer>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Toolbar variant="dense" />
                <Outlet />
                <Suspense>
                    <TanStackRouterDevtools />
                </Suspense>
            </Box>
        </Box>
    );
};

export default AppLayout;
1;
