import { IconButton, IconButtonProps, styled } from '@mui/material';

interface AppBarButtonProps extends IconButtonProps {}

const AppBarButton = styled(
    IconButton,
    {},
)<AppBarButtonProps>(({}) => ({
    pointerEvents: 'auto',
}));

export default AppBarButton;
export type { AppBarButtonProps };
