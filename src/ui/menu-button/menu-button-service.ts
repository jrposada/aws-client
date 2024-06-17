import { Dispatch, MouseEventHandler, SetStateAction } from 'react';

type ContextMenu = {
    mouseY: number;
    mouseX: number;
};

class MenuButtonService {
    get contextMenu(): ContextMenu | null {
        return this.#contextMenu;
    }

    #contextMenu: ContextMenu | null = null;

    constructor(
        private _setter: Dispatch<SetStateAction<ContextMenu | null>>,
    ) {}

    handleOpen: MouseEventHandler<HTMLElement> = (event) => {
        event.preventDefault();
        this._setter((prev) =>
            prev === null
                ? {
                      mouseX: event.clientX - 2,
                      mouseY: event.clientY - 4,
                  }
                : null,
        );
    };

    close = () => {
        this._setter(null);
    };

    _refresh(contextMenu: ContextMenu | null): void {
        this.#contextMenu = contextMenu;
    }
}

export { MenuButtonService };
export type { ContextMenu };
