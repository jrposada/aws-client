import { IconButton as MuiIconButton, styled } from '@mui/material';

const IconButton = styled(MuiIconButton)(({ theme }) => ({
    position: 'absolute',
    right: 0,
    opacity: 0,
    transition: theme.transitions.create(['opacity'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    zIndex: 1,
}));

export default IconButton;
