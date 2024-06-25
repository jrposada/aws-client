import { Snackbar } from '@mui/material';
import { CustomContentProps } from 'notistack';
import { forwardRef } from 'react';
import SnackbarContent from './styled/snackbar-content';

type ErrorSnackbarProps = Omit<CustomContentProps, 'children'>;

const ErrorSnackbar = forwardRef<HTMLDivElement, ErrorSnackbarProps>(
    ({ autoHideDuration, ...props }, ref) => {
        return (
            <SnackbarContent {...(props as any)} variant="error" ref={ref}>
                <Snackbar />;
            </SnackbarContent>
        );
    },
);

export default ErrorSnackbar;
export type { ErrorSnackbarProps };
