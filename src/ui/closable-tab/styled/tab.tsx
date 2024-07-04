import { Tab as MuiTab, styled } from '@mui/material';

const Tab = styled(MuiTab)(({ theme }) => ({
    '& .close-icon': {
        position: 'absolute',
        right: 5,
        fontSize: '1rem',
        opacity: 0,
        transition: theme.transitions.create(['opacity'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shortest,
        }),
    },
    '&:hover': {
        '& .close-icon': {
            opacity: 1,
        },
    },
}));

export default Tab;
