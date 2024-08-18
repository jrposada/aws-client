import {
    save as tauriSaveDialog,
    open as tauriOpenDialog,
} from '@tauri-apps/api/dialog';

const EXTENSION = 'aws-client';

export async function saveAsDialog(): Promise<string> {
    let value = await tauriSaveDialog({
        title: 'Save as',
        filters: [{ name: 'AWS Client', extensions: [EXTENSION] }],
    });

    if (!value && typeof value !== 'string') {
        return '';
    }

    if (!value.endsWith(`.${EXTENSION}`)) {
        value = `${value}.${EXTENSION}`;
    }

    return value;
}

export async function openDialog(): Promise<string> {
    let value = await tauriOpenDialog({
        title: 'Open',
        filters: [{ name: 'AWS Client', extensions: [EXTENSION] }],
    });

    if (!value || typeof value !== 'string') {
        return '';
    }

    return value;
}
