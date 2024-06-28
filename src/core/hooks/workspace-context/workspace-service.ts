import { invoke } from '@tauri-apps/api';
import { open, save } from '@tauri-apps/api/dialog';
import { t } from 'i18next';
import { Dispatch, SetStateAction } from 'react';
import { v4 as uuid } from 'uuid';
import { rdsSend } from '../../commands/rds';
import { Request, RequestResult, RequestType } from './request';
import { findIndexById } from '../../utils/find-index-by-id';
import { removeById } from '../../utils/remove-by-id';
import { updateById } from '../../utils/update-by-id';
import { findById } from '../../utils/find-by-id';

type WorkspaceServiceSetters = {
    savedState: Dispatch<SetStateAction<WorkspaceServiceState>>;
    state: Dispatch<SetStateAction<WorkspaceServiceState>>;
};

export type WorkspaceServiceState = {
    currentRequest: Request | undefined;
    filepath: string | undefined;
    openRequests: Request[];
    requests: Request[];
};

const commands = {
    rds: rdsSend,
};

const extension = 'aws-client';

export const DEFAULT_STATE: WorkspaceServiceState = {
    currentRequest: undefined,
    filepath: undefined,
    openRequests: [],
    requests: [],
};

export class WorkspaceService {
    get currentRequest(): Request | undefined {
        return this.#state.currentRequest;
    }

    get currentRequestIndex(): number | undefined {
        if (!this.#state.currentRequest?.id) {
            return;
        }

        return findIndexById(
            this.#state.currentRequest.id,
            this.#state.openRequests,
        );
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

    get openRequests(): Request[] {
        return this.#state.openRequests;
    }

    get requests(): Request[] {
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
                openRequests: [...prev.openRequests, request],
                requests: [...prev.requests, request],
            };

            return next;
        });
    }

    /**
     * Close a request.
     * @param id Request's ID to remove.
     */
    closeRequestById(id: string): void {
        this._setters.state((prev) => {
            const next: WorkspaceServiceState = { ...prev };

            // First, remove from open requests if it is open.
            next.openRequests = removeById(id, prev.openRequests);

            // Second, update current request if it matches IDs.
            if (prev.currentRequest?.id === id) {
                const nextCurrentIndex = findIndexById(id, prev.openRequests);

                if (nextCurrentIndex >= next.openRequests.length) {
                    next.currentRequest =
                        next.openRequests[next.openRequests.length - 1];
                } else {
                    next.currentRequest = next.openRequests[nextCurrentIndex];
                }
            }

            return next;
        });
    }

    /** Open workspace.
     * @param filepath If not defined then it load internal app state.
     */
    async loadWorkspace(filepath?: string): Promise<void> {
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

    /**
     * Prompt user to select a workspace file in their machine and loads it.
     */
    async openWorkspace(): Promise<void> {
        const filepath = await open({
            multiple: false,
            title: 'Open',
            filters: [{ name: 'AWS Client', extensions: ['aws-client'] }],
        });

        if (!filepath && typeof filepath !== 'string') {
            return;
        }

        return this.loadWorkspace(filepath as string); // String type checked above.
    }

    /**
     * Remove a request from the workspace.
     * @param id Request's ID to remove.
     */
    removeRequestById(id: string): void {
        this._setters.state((prev) => {
            const next: WorkspaceServiceState = { ...prev };

            // First, remove request from workspace requests.
            next.requests = removeById(id, prev.requests);

            // Second, remove from open requests if it is open.
            next.openRequests = removeById(id, prev.openRequests);

            // Third, update current request if it matches IDs.
            if (prev.currentRequest?.id === id) {
                const nextCurrentIndex = findIndexById(id, prev.openRequests);

                if (nextCurrentIndex >= next.openRequests.length) {
                    next.currentRequest =
                        next.openRequests[next.openRequests.length - 1];
                } else {
                    next.currentRequest = next.openRequests[nextCurrentIndex];
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
            this._setters.savedState(nextStates);
            this._setters.state(nextStates);

            resolve();
        });
    }

    /**
     * Save current request to current given workspace file.
     * @param filepath Workspace file
     */
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

    setCurrentRequestById(id: string): void {
        this._setters.state((prev) => {
            const next: WorkspaceServiceState = { ...prev };

            let request = findById(id, prev.openRequests);
            if (!request) {
                // Need to open request first.
                request = findById(id, prev.requests);

                if (!request) {
                    throw new Error(
                        `Can not set current id. ID "${id}" not found`,
                    );
                }

                next.openRequests.push(request);
            }

            // Second current request
            next.currentRequest = findById(id, next.openRequests);

            return next;
        });
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
            const result = (await commands[request.requestType](
                request.data as any,
            )) as RequestResult;

            this.#updateRequestById(request.id, {
                result,
            });
        };

        const setData: Request['setData'] = (setter) => {
            const value =
                typeof setter !== 'function' ? setter : setter(request.data);

            this.#updateRequestById(request.id, {
                data: value,
                isDirty: true,
            });
        };

        const setTitle: Request['setTitle'] = (setter) => {
            const value =
                typeof setter !== 'function' ? setter : setter(request.title);

            this.#updateRequestById(request.id, {
                title: value,
            });
        };

        request.send = send;
        request.setData = setData;
        request.setTitle = setTitle;
    }

    #updateRequestById(id: string, request: Partial<Request>) {
        this._setters.state((prev) => {
            const next: WorkspaceServiceState = { ...prev };

            // First, update request from workspace requests.
            next.requests = updateById(id, request, prev.requests);

            // Second, update open requests if it is open.
            next.openRequests = updateById(id, request, prev.openRequests);

            // Third, update current request if it matches IDs.
            if (prev.currentRequest?.id === id) {
                const currentRequest = findById(id, prev.openRequests);
                if (currentRequest) {
                    next.currentRequest = {
                        ...currentRequest,
                        ...request,
                    };
                }
            }

            return next;
        });
    }
}
