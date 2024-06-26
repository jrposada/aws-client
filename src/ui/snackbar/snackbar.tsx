import { Snackbar as MuiSnackbar } from '@mui/material';
import { CustomContentProps } from 'notistack';
import { forwardRef } from 'react';
import SnackbarContent from './styled/snackbar-content';

type SnackbarProps = Omit<CustomContentProps, 'children'>;

const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(
    ({ autoHideDuration, ...props }, ref) => {
        return (
            <SnackbarContent {...(props as any)} ref={ref}>
                <MuiSnackbar />;
            </SnackbarContent>
        );
    },
);

export default Snackbar;
export type { SnackbarProps };
