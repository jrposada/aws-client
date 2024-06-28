import { findIndexById } from './find-index-by-id';

type Item = {
    id: string;
};

export function removeById<T extends Item>(id: string, items: T[]): T[] {
    const index = findIndexById(id, items);
    if (index < 0) {
        return items;
    }

    return [...items.slice(0, index), ...items.slice(index + 1)];
}
