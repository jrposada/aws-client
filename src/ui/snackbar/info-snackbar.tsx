import { Snackbar } from '@mui/material';
import { CustomContentProps } from 'notistack';
import { forwardRef } from 'react';
import SnackbarContent from './styled/snackbar-content';

type InfoSnackbarProps = Omit<CustomContentProps, 'children'>;

const InfoSnackbar = forwardRef<HTMLDivElement, InfoSnackbarProps>(
    ({ autoHideDuration, ...props }, ref) => {
        return (
            <SnackbarContent {...(props as any)} variant="info" ref={ref}>
                <Snackbar />;
            </SnackbarContent>
        );
    },
);

export default InfoSnackbar;
export type { InfoSnackbarProps };
