import { Tab as MuiTab, styled } from '@mui/material';

const Tab = styled(MuiTab)(({}) => ({
    position: 'relative',
    '&:hover': {
        '& .close-icon': {
            opacity: 1,
        },
    },
}));

export default Tab;
