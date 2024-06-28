import { findIndexById } from './find-index-by-id';

type Item = {
    id: string;
};

export function updateById<T extends Item>(
    id: string,
    item: Partial<T>,
    items: T[],
) {
    const index = findIndexById(id, items);
    if (index < 0) {
        return items;
    }

    items[index] = {
        ...items[index],
        ...item,
    };

    return [...items];
}
