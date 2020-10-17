import { Builder } from './builder';

export class IoC {
    private static _instance = new IoC();

    static get instance(): IoC {
        return IoC._instance;
    }

    private _deps = new Map<any, Set<any>>();

    add(type: any, implementation: any) {
        const set = this._deps.get(type) || new Set();

        set.add(implementation);

        this._deps.set(type, set);
    }

    register(implementation: any): Builder {
        return new Builder({
            implementation,
            add: this.add.bind(this),
        });
    }

    resolve<T>(key: (new (...args: any[]) => T)): T {
        const dependency = this._deps.get(key).values().next().value;

        return this._createInstance(dependency);
    }

    resolveAll<T>(key: (new (...args: any[]) => T)): T[] {
        const dependencies = this._deps.get(key);

        return Array.from(dependencies || [])
            .map((dependency: any) => this._createInstance(dependency));
    }

    private _createInstance<T>(Dependency: (new (...args: any[]) => T)): T {
        const argTypes = Reflect.getMetadata('design:paramtypes', Dependency);
        const args = (argTypes || []).map((type: any, index: number) => {
            const metadata = Reflect.getMetadata(index, Dependency);

            return metadata || IoC._instance.resolve(type);
        });

        return new Dependency(...args);
    }
}
