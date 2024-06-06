import styled from '@emotion/styled';
import AppBarIconButton, { AppBarIconButtonProps } from './app-bar-icon-button';

interface AppWindowButtonProps extends AppBarIconButtonProps {}

const AppWindowButton = styled(
    AppBarIconButton,
    {},
)<AppWindowButtonProps>(({}) => ({
    borderRadius: 0,
    height: '3rem',
    width: '3rem',
}));

export default AppWindowButton;
export type { AppWindowButtonProps };
