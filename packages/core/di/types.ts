export type Provider = ValueProvider | ClassProvider | FactoryProvider | ProvideProvider | any;

export interface ProvideProvider {
    provide: any;
}

export interface ValueProvider {
    provide: any;
    useValue?: any;
}


export interface ClassProvider {
    provide: any;
    useClass?: any;
    deps: Provider[];
    multiple?: boolean;
}

export interface FactoryProvider {
    provide: any;
    useFactory?: any;
    deps: Provider[];
    multiple?: boolean;
}

