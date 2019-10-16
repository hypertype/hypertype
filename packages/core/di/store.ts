import {Provider} from "./types";


export class Store {


    private providers: Provider[] = [];

    constructor(global = false) {
        if (!global) {
            this.providers = [...GlobalStore.providers];
        }
    }


    register(provider: Provider | Store) {
        if (provider instanceof Store) {
            provider.providers.forEach(p => this.register(p));
        } else {
            if (!provider.provide)
                provider = {provide: provider};
            this.providers.push(provider);
            return provider;
        }
    }

    find(type) {
        return this.providers.filter(p => p.provide == type).pop();
    }

    public getProviders() {
        return this.providers;
    }
}

export const GlobalStore = new Store(true);