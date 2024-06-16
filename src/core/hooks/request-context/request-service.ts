import { Dispatch, SetStateAction } from 'react';
import { v4 as uuid } from 'uuid';
import { dynamodbSend } from '../../commands/dynamodb';
import { rdsSend } from '../../commands/rds';
import { Request, RequestType } from './request';
import { invoke } from '@tauri-apps/api';

type RequestServiceSetters = {
    setCurrentRequest: Dispatch<SetStateAction<Request | undefined>>;
    setRequests: Dispatch<SetStateAction<Request[]>>;
};

type RequestServiceStates = {
    currentRequest: Request | undefined;
    requests: Request[];
};

const commands = {
    'dynamo-db': dynamodbSend,
    'open-search': () => {},
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

    get requests() {
        return this.#requests;
    }

    #currentRequest: Request | undefined;
    #requests: Request[] = [];

    constructor(private _setters: RequestServiceSetters) {}

    addRequest(type: RequestType): void {
        this._setters.setRequests((prev) => {
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

            const next = [...prev, request];
            this._setters.setCurrentRequest(request);

            return next;
        });
    }

    async load(): Promise<void> {
        return invoke<string>('load_app_state').then((stateStr) => {
            const state = JSON.parse(stateStr);

            this._setters.setCurrentRequest(state.currentRequest);
            this._setters.setRequests(state.requests ?? []);
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

        this._setters.setRequests((prev) => {
            if (index < 0 || index > prev.length) {
                console.error(
                    `Error removing request with index "${indexString}". Index out of bounds`,
                );
                return prev;
            }

            const next = [...prev.slice(0, index), ...prev.slice(index + 1)];

            if (this.currentRequestIndex ?? index >= next.length) {
                this._setters.setCurrentRequest(next[next.length - 1]);
            }

            return next;
        });
    }

    async save(): Promise<string> {
        return invoke<string>('save_app_state', {
            state: JSON.stringify({
                currentRequest: this.#currentRequest,
                requests: this.#requests,
            }),
        });
    }

    setCurrentRequestByIndex(index: number): void {
        this._setters.setCurrentRequest(this.requests[index]);
    }

    _refresh(states: RequestServiceStates, save: boolean): void {
        this.#currentRequest = states.currentRequest;
        this.#requests = states.requests;

        if (this.#currentRequest) {
            this.#hookRequest(this.#currentRequest);
        }

        this.#requests.forEach((request) => {
            this.#hookRequest(request);
        });

        if (save) {
            this.save();
        }
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
            return await commands[request.requestType](request.data as any);
        };

        request.setData = setData;
        request.send = send;
    }

    #updateRequestAtIndex(index: number, request: Request) {
        if (this.#currentRequest?.id === request.id) {
            this._setters.setCurrentRequest(request);
        }
        this._setters.setRequests((prev) => {
            const next = [...prev];
            next[index] = request;
            return next;
        });
    }
}

export { RequestService };
export type { Request, RequestType };
