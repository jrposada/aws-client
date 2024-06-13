import { Dispatch, SetStateAction } from 'react';
import { v4 as uuid } from 'uuid';
import { dynamodbSend } from '../../commands/dynamodb';
import { rdsSend } from '../../commands/rds';

type RequestType = 'dynamo-db' | 'open-search' | 'rds';

type TabData = {
    id: string;
    requestType: RequestType;
    send: () => Promise<void>;
    setText: Dispatch<SetStateAction<string>>;
    text: string;
    title: string;
};

type RequestServiceSetters = {
    setCurrentTab: Dispatch<SetStateAction<TabData | undefined>>;
    setTabs: Dispatch<SetStateAction<TabData[]>>;
};

type RequestServiceStates = {
    currentTab: TabData | undefined;
    tabs: TabData[];
};

const commands = {
    'dynamo-db': dynamodbSend,
    'open-search': () => {},
    rds: rdsSend,
};

class RequestService {
    get currentTab(): TabData | undefined {
        return this.#currentTab;
    }

    get currentTabIndex(): number | undefined {
        return this.#tabs.findIndex((tab) => tab.id === this.#currentTab?.id);
    }

    get tabs() {
        return this.#tabs;
    }

    #currentTab: TabData | undefined;
    #tabs: TabData[] = [];

    constructor(private _setters: RequestServiceSetters) {}

    addTab(type: RequestType): void {
        this._setters.setTabs((prev) => {
            const id = uuid();

            const tab: TabData = {
                title: type,
                id,
                requestType: type,
                text: type,
                setText: () => {}, // needs to be hooked below
                send: async () => {}, // needs to be hooked below
            };
            this.#hookTab(tab);

            const next = [...prev, tab];
            this._setters.setCurrentTab(tab);
            return next;
        });
    }

    removeTab(indexString: string | undefined) {
        const index = Number(indexString);
        if (!indexString || isNaN(index)) {
            console.error(
                `Error removing tab with index "${indexString}". Invalid index`,
            );
            return;
        }

        this._setters.setTabs((prev) => {
            if (index < 0 || index > prev.length) {
                console.error(
                    `Error removing tab with index "${indexString}". Index out of bounds`,
                );
                return prev;
            }

            const next = [...prev.slice(0, index), ...prev.slice(index + 1)];

            if (this.currentTabIndex ?? index >= next.length) {
                this._setters.setCurrentTab(next[next.length - 1]);
            }

            return next;
        });
    }

    setCurrentTabByIndex(index: number): void {
        this._setters.setCurrentTab(this.tabs[index]);
    }

    _refresh(states: RequestServiceStates): void {
        this.#currentTab = states.currentTab;
        this.#tabs = states.tabs;

        if (this.#currentTab) {
            this.#hookTab(this.#currentTab);
        }

        this.#tabs.forEach((tab) => {
            this.#hookTab(tab);
        });
    }

    #hookTab(tab: TabData) {
        const setText: TabData['setText'] = (setter) => {
            const tabIndex = this.#tabs.findIndex((item) => item.id === tab.id);

            if (tabIndex < 0) {
                throw new Error(`Tab with id "${tab.id}" not found`);
            }

            const value =
                typeof setter !== 'function'
                    ? setter
                    : setter(this.#tabs[tabIndex].text);

            this.#updateTabAtIndex(tabIndex, {
                ...this.#tabs[tabIndex],
                text: value,
            });
        };

        const send: TabData['send'] = async () => {
            await commands[tab.requestType]({ profileName: 'aws-client-dev' });
        };

        tab.setText = setText;
        tab.send = send;
    }

    #updateTabAtIndex(index: number, tab: TabData) {
        if (this.#currentTab?.id === tab.id) {
            this._setters.setCurrentTab(tab);
        }
        this._setters.setTabs((prev) => {
            const next = [...prev];
            next[index] = tab;
            return next;
        });
    }
}

export { RequestService };
export type { RequestType, TabData as TabInfo };
