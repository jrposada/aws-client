import { useContext } from 'react';
import menuButtonContext from './menu-button-context';

export function useMenuButton() {
    const service = useContext(menuButtonContext);

    if (!service) {
        throw new Error(
            '<MenuButtonItem /> must be a children of <MenuButton />',
        );
    }

    return service;
}
