import {
    AppBar as MuiAppBar,
    AppBarProps as MuiAppBarProps,
    styled,
} from '@mui/material';

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(
    MuiAppBar,
    {},
)<AppBarProps>(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
}));

export default AppBar;
export type { AppBarProps };
