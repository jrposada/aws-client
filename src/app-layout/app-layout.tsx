import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import {
    Box,
    Container,
    Divider,
    IconButton,
    List,
    Toolbar,
    Typography,
} from '@mui/material';
import { Outlet } from '@tanstack/react-router';
import { t } from 'i18next';
import { Suspense, lazy } from 'react';
import { useLocalStorage } from '../core/hooks/use-local-storage/use-local-storage';
import AppBar from './app-bar';
import AppDrawer from './app-drawer';
import { navigationItems } from './navigation-items';

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
            <AppBar position="absolute" open={open}>
                <Toolbar
                    sx={{
                        pr: '24px', // keep right padding when drawer closed
                    }}
                >
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: '36px',
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        sx={{ flexGrow: 1 }}
                    >
                        {t('home')}
                    </Typography>
                </Toolbar>
            </AppBar>
            <AppDrawer variant="permanent" open={open}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: [1],
                    }}
                >
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component="nav">{navigationItems}</List>
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
