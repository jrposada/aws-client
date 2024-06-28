type Item = {
    id: string;
};

export function findIndexById<T extends Item>(id: string, items: T[]): number {
    return items.findIndex((item) => item.id === id);
}
