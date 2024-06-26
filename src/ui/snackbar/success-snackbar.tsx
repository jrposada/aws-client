import { Snackbar } from '@mui/material';
import { CustomContentProps } from 'notistack';
import { forwardRef } from 'react';
import SnackbarContent from './styled/snackbar-content';

type SuccessSnackbarProps = Omit<CustomContentProps, 'children'>;

const SuccessSnackbar = forwardRef<HTMLDivElement, SuccessSnackbarProps>(
    ({ autoHideDuration, ...props }, ref) => {
        return (
            <SnackbarContent {...(props as any)} variant="success" ref={ref}>
                <Snackbar />;
            </SnackbarContent>
        );
    },
);

export default SuccessSnackbar;
export type { SuccessSnackbarProps };
