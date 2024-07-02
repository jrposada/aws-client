import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import { rootRoute } from './root-route';
import { routes } from './routes';
import ErrorSnackbar from './ui/snackbar/error-snackbar';
import InfoSnackbar from './ui/snackbar/info-snackbar';
import Snackbar from './ui/snackbar/snackbar';
import SuccessSnackbar from './ui/snackbar/success-snackbar';
import WarningSnackbar from './ui/snackbar/warning-snackbar';

const defaultTheme = createTheme();
const queryClient = new QueryClient();

const routeTree = rootRoute.addChildren(routes);
const router = createRouter({ routeTree });

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={defaultTheme}>
            <QueryClientProvider client={queryClient}>
                {/* The rest of your application */}
                <SnackbarProvider
                    maxSnack={3}
                    Components={{
                        default: Snackbar,
                        error: ErrorSnackbar,
                        info: InfoSnackbar,
                        success: SuccessSnackbar,
                        warning: WarningSnackbar,
                    }}
                >
                    <CssBaseline />
                    <RouterProvider
                        router={router}
                        basepath={import.meta.env.BASE_URL}
                    />
                </SnackbarProvider>

                <ReactQueryDevtools initialIsOpen={true} />
            </QueryClientProvider>
        </ThemeProvider>
    </React.StrictMode>,
);
