import { save as saveDialog } from '@tauri-apps/plugin-dialog';

const EXTENSION = 'aws-client';

export async function saveAsDialog(): Promise<string> {
    let value = await saveDialog({
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
