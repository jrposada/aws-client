import { Menu } from '@mui/material';
import { PropsWithChildren, forwardRef, useImperativeHandle } from 'react';
import { useCreateMenuButtonContext } from './create-menu-button-context';
import { MenuButtonService } from './menu-button-service';

type MenuButtonProps = {};

const MenuButton = forwardRef<
    MenuButtonService,
    PropsWithChildren<MenuButtonProps>
>(({ children }, ref) => {
    const { menuButtonContext, menuButtonService } =
        useCreateMenuButtonContext();

    useImperativeHandle(ref, () => {
        return menuButtonService;
    });

    return (
        <>
            <menuButtonContext.Provider value={menuButtonService}>
                <Menu
                    open={menuButtonService.contextMenu !== null}
                    onClose={menuButtonService.close}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        menuButtonService.contextMenu !== null
                            ? {
                                  top: menuButtonService.contextMenu.mouseY,
                                  left: menuButtonService.contextMenu.mouseX,
                              }
                            : undefined
                    }
                >
                    {children}
                </Menu>
            </menuButtonContext.Provider>
        </>
    );
});

export default MenuButton;
export type { MenuButtonProps };
