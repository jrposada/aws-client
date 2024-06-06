import { IconButton, IconButtonProps, styled } from '@mui/material';

interface AppBarIconButtonProps extends IconButtonProps {}

const AppBarIconButton = styled(
    IconButton,
    {},
)<AppBarIconButtonProps>(({}) => ({
    pointerEvents: 'auto',
}));

export default AppBarIconButton;
export type { AppBarIconButtonProps };
