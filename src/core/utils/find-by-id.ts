type Item = {
    id: string;
};

export function findById<T extends Item>(
    id: string,
    items: T[],
): T | undefined {
    return items.find((item) => item.id === id);
}
