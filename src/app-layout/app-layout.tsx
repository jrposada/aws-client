import { Box, Container, Divider, List, Toolbar } from '@mui/material';
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
            <AppBar open={open} toggleDrawer={toggleDrawer} />

            <AppDrawer variant="permanent" open={open}>
                <Toolbar
                    variant="dense"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: [1],
                    }}
                ></Toolbar>
                <Divider />
                <List component="nav">
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
                <Toolbar />
                <Container
                    maxWidth={false}
                    sx={{
                        mt: 4,
                        mb: 4,
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Outlet />
                    <Suspense>
                        <TanStackRouterDevtools />
                    </Suspense>
                </Container>
            </Box>
        </Box>
    );
};

export default AppLayout;
1;
