import { invoke } from '@tauri-apps/api';
import { open, save } from '@tauri-apps/api/dialog';
import { Dispatch, SetStateAction } from 'react';
import { v4 as uuid } from 'uuid';
import { rdsSend } from '../../commands/rds';
import { Request, RequestResult, RequestType } from './request';
import { t } from 'i18next';

type WorkspaceServiceSetters = {
    savedState: Dispatch<SetStateAction<WorkspaceServiceState>>;
    state: Dispatch<SetStateAction<WorkspaceServiceState>>;
};

export type WorkspaceServiceState = {
    currentRequest: Request | undefined;
    filepath: string | undefined;
    requests: Request[];
};

const commands = {
    rds: rdsSend,
};

const extension = 'aws-client';

export const DEFAULT_STATE: WorkspaceServiceState = {
    currentRequest: undefined,
    filepath: undefined,
    requests: [],
};

export class WorkspaceService {
    get currentRequest(): Request | undefined {
        return this.#state.currentRequest;
    }

    get currentRequestIndex(): number | undefined {
        return this.#findRequestIndexById(this.#state.currentRequest?.id);
    }

    get filepath(): string | undefined {
        return this.#state.filepath;
    }

    get filename(): string | undefined {
        const filenameWithExtension = this.filepath
            ?.split('/')
            .pop()
            ?.split('\\')
            .pop();

        return filenameWithExtension?.substring(
            0,
            filenameWithExtension.lastIndexOf('.'),
        );
    }

    get requests() {
        return this.#state.requests;
    }

    #state: WorkspaceServiceState = DEFAULT_STATE;
    #savedState: WorkspaceServiceState = DEFAULT_STATE;

    constructor(private _setters: WorkspaceServiceSetters) {}

    addRequest(type: RequestType): void {
        this._setters.state((prev) => {
            const id = uuid();

            const request: Request = {
                data: {
                    profileName: 'default',
                    database: 'scon',
                    secretArn:
                        'arn:aws:secretsmanager:us-east-1:220162591379:secret:scon-supply-connections-db-test-readonly-password-secret-zuWRhJ',
                    clusterArn:
                        'arn:aws:rds:us-east-1:220162591379:cluster:scon-test-supply-connections-db-cluster',
                    query: 'select * from connection_task_template limit 1',
                } as any,
                id,
                isDirty: true,
                requestType: type,
                send: async () => {}, // needs to be hooked below
                setData: () => {}, // needs to be hooked below
                setTitle: () => {}, // needs to be hooked below
                title: t('workspace-service.new', { type }),
            };
            this.#hookRequest(request);

            const next: WorkspaceServiceState = {
                ...prev,
                currentRequest: request,
                requests: [...prev.requests, request],
            };

            return next;
        });
    }

    /** Open workspace.
     * @param filepath If not defined then it load internal app state.
     */
    async load(filepath?: string): Promise<void> {
        const stateStr = await invoke<string>('load_app_state', { filepath });

        const state = JSON.parse(stateStr) as WorkspaceServiceState;

        this._setters.state((prev) => ({
            ...prev,
            ...state,
        }));

        if (!filepath && state.filepath) {
            // We loaded an internal state which has a reference to a saved
            // workspace. Load that as saved.
            const savedStateStr = await invoke<string>('load_app_state', {
                filepath: state.filepath,
            });

            const savedState = JSON.parse(
                savedStateStr,
            ) as WorkspaceServiceState;

            this._setters.savedState((prev) => ({ ...prev, savedState }));
        }
    }

    async open(): Promise<void> {
        const filepath = await open({
            multiple: false,
            title: 'Open',
            filters: [{ name: 'AWS Client', extensions: ['aws-client'] }],
        });

        if (!filepath && typeof filepath !== 'string') {
            return;
        }

        return this.load(filepath as string); // String type checked above.
    }

    removeRequest(indexString: string | undefined) {
        const index = Number(indexString);
        if (!indexString || isNaN(index)) {
            console.error(
                `Error removing request with index "${indexString}". Invalid index`,
            );
            return;
        }

        this._setters.state((prev) => {
            if (index < 0 || index > prev.requests.length) {
                console.error(
                    `Error removing request with index "${indexString}". Index out of bounds`,
                );
                return prev;
            }

            const next: WorkspaceServiceState = {
                ...prev,
                requests: [
                    ...prev.requests.slice(0, index),
                    ...prev.requests.slice(index + 1),
                ],
            };

            if (prev.currentRequest?.id === prev.requests[index].id) {
                // Current removed

                const nextCurrentIndex = prev.requests.findIndex(
                    (item) => item.id === prev.currentRequest?.id,
                );

                if (nextCurrentIndex >= next.requests.length) {
                    next.currentRequest =
                        next.requests[next.requests.length - 1];
                } else {
                    next.currentRequest = next.requests[nextCurrentIndex];
                }
            }

            return next;
        });
    }

    /** Save current workspace.
     * @param filepath If not defined then it will save to internal app state.
     */
    async save(filepath?: string): Promise<void> {
        return new Promise<void>(async (resolve) => {
            const savePromises: Promise<string>[] = [];

            // We want to save the full state. Just need to update all `isDirty`
            // flags.
            const nextStates = { ...this.#state };

            if (filepath) {
                if (nextStates.currentRequest) {
                    nextStates.currentRequest.isDirty = false;
                }

                nextStates.requests.forEach((item) => {
                    item.isDirty = false;
                });

                // Also save filepath.
                nextStates.filepath = filepath;
            }

            // Invoke save for internal state.
            savePromises.push(
                invoke<string>('save_app_state', {
                    state: JSON.stringify(nextStates),
                }),
            );
            // Invoke save for workspace file.
            if (filepath) {
                savePromises.push(
                    invoke<string>('save_app_state', {
                        state: JSON.stringify(nextStates),
                        filepath,
                    }),
                );
            }

            // Update React states
            // FIXME: we should not use previous values outside of setter
            this._setters.savedState(nextStates);
            this._setters.state(nextStates);

            resolve();
        });
    }

    async saveCurrent(filepath: string): Promise<void> {
        return new Promise<void>(async (resolve) => {
            const savePromises: Promise<string>[] = [];

            // Calculate saved internal state.
            // For internal state we want to save all, but just update the
            // is dirty for current request.
            const nextInternalState = { ...this.#state };

            if (nextInternalState.currentRequest) {
                nextInternalState.currentRequest.isDirty = false;
                nextInternalState.requests.find(
                    (item) => item.id === nextInternalState.currentRequest!.id,
                )!.isDirty = false;
            }

            // Also save filepath.
            nextInternalState.filepath = filepath;

            // Invoke save.
            savePromises.push(
                invoke<string>('save_app_state', {
                    state: JSON.stringify(nextInternalState),
                }),
            );

            // Calculate next saved state.
            // For next saved state we want to keep same saved as before
            // and just modify current request values with those in state.
            const nextSavedState = { ...this.#savedState };

            if (this.#state.currentRequest) {
                // There is a current request in the editor. Save it to file
                nextSavedState.currentRequest = this.#state.currentRequest;
                nextSavedState.currentRequest.isDirty = false;

                const index = nextSavedState.requests.findIndex(
                    (item) => item.id === nextSavedState.currentRequest!.id,
                );
                if (index < 0) {
                    // New current requests is not in the saved version. Add it.
                    nextSavedState.requests.push(nextSavedState.currentRequest);
                } else {
                    // There is already a saved version. Update it.
                    nextSavedState.requests[index] =
                        nextSavedState.currentRequest;
                }
            } else if (nextSavedState.currentRequest) {
                // There is NOT a current request in the editor, but there is
                // in the saved file. Remove it.
                delete nextSavedState.currentRequest;
            }

            // Also save filepath
            nextSavedState.filepath = filepath;

            // Invoke save
            savePromises.push(
                invoke<string>('save_app_state', {
                    state: JSON.stringify(nextSavedState),
                    filepath,
                }),
            );

            await Promise.all(savePromises);

            // Update React states
            // FIXME: we should not use previous state outside of setter
            this._setters.savedState(nextSavedState);
            this._setters.state((prev) => {
                // Next state is not same as next saved. We have to keep old
                // state and just update isDirty flags.
                const next = { ...prev };
                if (next.currentRequest) {
                    next.currentRequest.isDirty = false;

                    next.requests.find(
                        (item) => item.id === next.currentRequest!.id,
                    )!.isDirty = false;
                }
                next.filepath = filepath;

                return next;
            });

            resolve();
        });
    }

    async saveAs() {
        try {
            let filepath = await save({
                title: 'Save as',
                filters: [{ name: 'AWS Client', extensions: ['aws-client'] }],
            });

            if (!filepath && typeof filepath !== 'string') {
                return;
            }

            if (!filepath.endsWith(`.${extension}`)) {
                filepath = `${filepath}.${extension}`;
            }

            this.save(filepath as string) // String type checked above.
                .then(() => console.log('save')) // TODO toast
                .catch(() => console.log('error'));
        } catch (error) {
            console.error('Failed to select file:', error);
        }
    }

    async saveCurrentAs(): Promise<void> {
        try {
            let filepath = await save({
                title: 'Save as',
                filters: [{ name: 'AWS Client', extensions: ['aws-client'] }],
            });

            if (!filepath && typeof filepath !== 'string') {
                return;
            }

            if (!filepath.endsWith(`.${extension}`)) {
                filepath = `${filepath}.${extension}`;
            }

            this.saveCurrent(filepath as string) // String type checked above.
                .then(() => console.log('save')) // TODO toast
                .catch(() => console.log('error'));
        } catch (error) {
            console.error('Failed to select file:', error);
        }
    }

    setCurrentRequestByIndex(index: number): void {
        this._setters.state((prev) => ({
            ...prev,
            currentRequest: prev.requests[index],
        }));
    }

    _refresh(
        state: WorkspaceServiceState,
        savedState: WorkspaceServiceState,
    ): void {
        this.#state = state;
        this.#savedState = savedState;

        console.log('state', this.#state);

        // We only need to hook up state, not saved state.
        if (this.#state.currentRequest) {
            this.#hookRequest(this.#state.currentRequest);
        }

        this.#state.requests.forEach((request) => {
            this.#hookRequest(request);
        });
    }

    #hookRequest(request: Request) {
        const send: Request['send'] = async () => {
            const requestIndex = this.#findRequestIndexById(request.id);

            const result = (await commands[request.requestType](
                request.data as any,
            )) as RequestResult;

            this.#updateRequestAtIndex(requestIndex, {
                ...this.#state.requests[requestIndex],
                result,
            });
        };

        const setData: Request['setData'] = (setter) => {
            const requestIndex = this.#findRequestIndexById(request.id);

            const value =
                typeof setter !== 'function' ? setter : setter(request.data);

            this.#updateRequestAtIndex(requestIndex, {
                ...this.#state.requests[requestIndex],
                data: value,
                isDirty: true,
            });
        };

        const setTitle: Request['setTitle'] = (setter) => {
            const requestIndex = this.#findRequestIndexById(request.id);

            const value =
                typeof setter !== 'function' ? setter : setter(request.title);

            this.#updateRequestAtIndex(requestIndex, {
                ...request,
                title: value,
            });
        };

        request.send = send;
        request.setData = setData;
        request.setTitle = setTitle;
    }

    #updateRequestAtIndex(index: number, request: Request) {
        this._setters.state((prev) => {
            const next: WorkspaceServiceState = { ...prev };

            if (prev.currentRequest?.id === request.id) {
                next.currentRequest = request;
            }

            next.requests[index] = request;

            return next;
        });
    }

    #findRequestIndexById<T extends string | undefined>(
        id: T,
    ): T extends string ? number : undefined {
        if (!id) return undefined as T extends string ? number : undefined;

        const requestIndex = this.#state.requests.findIndex(
            (item) => item.id === id,
        );

        if (requestIndex < 0) {
            throw new Error(`Request with id "${id}" not found`);
        }

        return requestIndex as T extends string ? number : undefined;
    }
}
