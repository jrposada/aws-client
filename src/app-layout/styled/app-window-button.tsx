import styled from '@emotion/styled';
import { blue } from '@mui/material/colors';
import AppBarButton, { AppBarButtonProps } from './app-bar-button';

interface AppWindowButtonProps extends AppBarButtonProps {}

const AppWindowButton = styled(
    AppBarButton,
    {},
)<AppWindowButtonProps>(({}) => ({
    borderRadius: 0,
    height: '3rem',
    width: '3rem',
}));

export default AppWindowButton;
export type { AppWindowButtonProps };
