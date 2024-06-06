import { Button, ButtonProps, styled } from '@mui/material';

interface AppBarButtonProps extends ButtonProps {}

const AppBarButton = styled(
    Button,
    {},
)<AppBarButtonProps>(({}) => ({
    pointerEvents: 'auto',
}));

export default AppBarButton;
export type { AppBarButtonProps };
