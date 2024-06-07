import { Dispatch, SetStateAction } from 'react';
import { v4 as uuid } from 'uuid';

type RequestType = 'dynamo-db' | 'open-search' | 'rds';

type TabData = {
    id: string;
    send: () => void;
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

    constructor(private setters: RequestServiceSetters) {}

    addTab(type: RequestType): void {
        this.setters.setTabs((prev) => {
            const id = uuid();

            const tab: TabData = {
                title: type,
                id,
                text: '',
                setText: () => {}, // needs to be hooked
                send: () => {}, // needs to be hooked
            };
            this.#hookTab(tab);

            const next = [...prev, tab];
            this.setters.setCurrentTab(tab);
            return next;
        });
    }

    setCurrentTab(id?: string): void {
        this.setters.setCurrentTab(
            this.tabs.find((tab) => tab.id === id) ??
                this.tabs[this.tabs.length - 1],
        );
    }

    setCurrentTabByIndex(index: number): void {
        this.setters.setCurrentTab(this.tabs[index]);
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

        const send: TabData['send'] = () => {
            console.log('Send', tab.text);
        };

        tab.setText = setText;
        tab.send = send;
    }

    #updateTabAtIndex(index: number, tab: TabData) {
        if (this.#currentTab?.id === tab.id) {
            this.setters.setCurrentTab(tab);
        }
        this.setters.setTabs((prev) => {
            const next = [...prev];
            next[index] = tab;
            return next;
        });
    }
}

export { RequestService };
export type { TabData as TabInfo, RequestType };

// const [greet, setGreet] = useState('');

// // now we can call our Command!
// invoke<string>('greet', { name: 'World' })
// // `invoke` returns a Promise
// .then((response) => setGreet(response));
