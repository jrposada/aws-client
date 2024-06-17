import { invoke } from '@tauri-apps/api';
import { save } from '@tauri-apps/api/dialog';
import { Dispatch, SetStateAction } from 'react';
import { v4 as uuid } from 'uuid';
import { rdsSend } from '../../commands/rds';
import { Request, RequestResult, RequestType } from './request';

export type RequestServiceState = {
    currentRequest: Request | undefined;
    filepath: string | undefined;
    requests: Request[];
};

const commands = {
    rds: rdsSend,
};

class RequestService {
    get currentRequest(): Request | undefined {
        return this.#currentRequest;
    }

    get currentRequestIndex(): number | undefined {
        return this.#requests.findIndex(
            (request) => request.id === this.#currentRequest?.id,
        );
    }

    get filepath(): string | undefined {
        return this.#filepath;
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
        return this.#requests;
    }

    #currentRequest: Request | undefined;
    #filepath: string | undefined;
    #requests: Request[] = [];

    constructor(
        private _setter: Dispatch<SetStateAction<RequestServiceState>>,
    ) {}

    addRequest(type: RequestType): void {
        this._setter((prev) => {
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
                requestType: type,
                send: async () => {}, // needs to be hooked below
                setData: () => {}, // needs to be hooked below
                title: type,
            };
            this.#hookRequest(request);

            const next: RequestServiceState = {
                ...prev,
                currentRequest: request,
                requests: [...prev.requests, request],
            };

            return next;
        });
    }

    async load(): Promise<void> {
        return invoke<string>('load_app_state').then((stateStr) => {
            const state = JSON.parse(stateStr) as RequestServiceState;

            this._setter((prev) => {
                return {
                    ...prev,
                    ...state,
                };
            });
        });
    }

    removeRequest(indexString: string | undefined) {
        const index = Number(indexString);
        if (!indexString || isNaN(index)) {
            console.error(
                `Error removing request with index "${indexString}". Invalid index`,
            );
            return;
        }

        this._setter((prev) => {
            if (index < 0 || index > prev.requests.length) {
                console.error(
                    `Error removing request with index "${indexString}". Index out of bounds`,
                );
                return prev;
            }

            const next: RequestServiceState = {
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
    async save(filepath?: string): Promise<string> {
        if (filepath) {
            this._setter((prev) => ({
                ...prev,
                filepath,
            }));
        }

        return invoke<string>('save_app_state', {
            state: JSON.stringify({
                currentRequest: this.#currentRequest,
                filepath: this.#filepath,
                requests: this.#requests,
            }),
            filepath,
        });
    }

    async saveAs() {
        try {
            const filepath = await save({
                title: 'Save as',
                filters: [{ name: 'AWS Client', extensions: ['aws-client'] }],
            });

            if (!filepath && typeof filepath !== 'string') {
                return;
            }

            this.save(filepath as string) // String type checked above.
                .then(() => console.log('save')) // TODO toast
                .catch(() => console.log('error'));
        } catch (error) {
            console.error('Failed to select file:', error);
        }
    }

    setCurrentRequestByIndex(index: number): void {
        this._setter((prev) => ({
            ...prev,
            currentRequest: prev.requests[index],
        }));
    }

    _refresh(states: RequestServiceState): void {
        this.#currentRequest = states.currentRequest;
        this.#filepath = states.filepath;
        this.#requests = states.requests;

        if (this.#currentRequest) {
            this.#hookRequest(this.#currentRequest);
        }

        this.#requests.forEach((request) => {
            this.#hookRequest(request);
        });
    }

    #hookRequest(request: Request) {
        const setData: Request['setData'] = (setter) => {
            const requestIndex = this.#requests.findIndex(
                (item) => item.id === request.id,
            );

            if (requestIndex < 0) {
                throw new Error(`Request with id "${request.id}" not found`);
            }

            const value =
                typeof setter !== 'function'
                    ? setter
                    : setter(this.#requests[requestIndex].data);

            this.#updateRequestAtIndex(requestIndex, {
                ...this.#requests[requestIndex],
                data: value,
            });
        };

        const send: Request['send'] = async () => {
            const result = (await commands[request.requestType](
                request.data as any,
            )) as RequestResult;

            const requestIndex = this.#requests.findIndex(
                (item) => item.id === request.id,
            );

            if (requestIndex < 0) {
                throw new Error(`Request with id "${request.id}" not found`);
            }

            this.#updateRequestAtIndex(requestIndex, {
                ...this.#requests[requestIndex],
                result,
            });
        };

        request.setData = setData;
        request.send = send;
    }

    #updateRequestAtIndex(index: number, request: Request) {
        this._setter((prev) => {
            const next: RequestServiceState = { ...prev };

            if (prev.currentRequest?.id === request.id) {
                next.currentRequest = request;
            }

            next.requests[index] = request;

            return next;
        });
    }
}

export { RequestService };
export type { Request, RequestType };
