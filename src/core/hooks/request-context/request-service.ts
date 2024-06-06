import { Dispatch, SetStateAction } from 'react';
import { v4 as uuid } from 'uuid';

type RequestType = 'dynamo-db' | 'open-search' | 'rds';

type TabData = {
    id: string;
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
            const tab: TabData = { title: type, id: uuid() };
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
    }
}

export { RequestService };
export type { TabData as TabInfo, RequestType };
