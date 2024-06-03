import { useCallback, useState } from 'react';

function stringifyValue(value: unknown) {
    let valueType = typeof value;
    let stringifiedValue = '';

    if (valueType === 'boolean') {
        stringifiedValue = (value as boolean).toString();
    } else if (valueType === 'string') {
        stringifiedValue = value as string;
    } else if (valueType === 'number') {
        stringifiedValue = (value as number).toString();
    } else if (valueType === 'object') {
        stringifiedValue = JSON.stringify(value);
    } else {
        throw new Error(`Unsupported type ${value} in useLocalStorage`);
    }

    return stringifiedValue;
}

function parseValue<T>(
    value: string,
    valueType:
        | 'string'
        | 'number'
        | 'bigint'
        | 'boolean'
        | 'symbol'
        | 'undefined'
        | 'object'
        | 'function',
): T {
    let parsedValue: T;

    if (valueType === 'boolean') {
        parsedValue = (value === 'true') as T;
    } else if (valueType === 'string') {
        parsedValue = value as T;
    } else if (valueType === 'number') {
        parsedValue = +value as T;
    } else if (valueType === 'object') {
        parsedValue = JSON.parse(value) as T;
    } else {
        throw new Error(`Unsupported type ${value} in useLocalStorage`);
    }

    return parsedValue;
}

export function useLocalStorage<T>(
    key: string,
    defaultValue: T,
): [T, (nextValue: T) => void] {
    let localStorageValue = localStorage.getItem(key);

    if (!localStorageValue) {
        localStorageValue = stringifyValue(defaultValue);
        localStorage.setItem(key, localStorageValue);
    }

    const parsedValue = parseValue<T>(localStorageValue, typeof defaultValue);

    const [value, setValue] = useState(parsedValue);

    const setLocalStorageValue = useCallback(
        (nextValue: T) => {
            localStorage.setItem(key, stringifyValue(nextValue));
            setValue(nextValue);
        },
        [key],
    );

    return [value, setLocalStorageValue];
}
