type Item = {
    id: string;
};

export function findIndexById<T extends Item>(
    id: string | undefined,
    items: T[],
): number {
    if (!id) return -1;

    return items.findIndex((item) => item.id === id);
}
