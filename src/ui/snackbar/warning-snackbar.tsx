import { Snackbar } from '@mui/material';
import { CustomContentProps } from 'notistack';
import { forwardRef } from 'react';
import SnackbarContent from './styled/snackbar-content';

type WarningSnackbarProps = Omit<CustomContentProps, 'children'>;

const WarningSnackbar = forwardRef<HTMLDivElement, WarningSnackbarProps>(
    ({ autoHideDuration, ...props }, ref) => {
        return (
            <SnackbarContent {...(props as any)} variant="warning" ref={ref}>
                <Snackbar />;
            </SnackbarContent>
        );
    },
);

export default WarningSnackbar;
export type { WarningSnackbarProps };
