import { Builder } from './builder';

export class IoC {
    private static _instance = new IoC();

    static get instance(): IoC {
        return IoC._instance;
    }

    private deps = new Map<any, Set<any>>();

    add(type: any, implementation: any) {
        const set = this.deps.get(type) || new Set();

        set.add(implementation);

        this.deps.set(type, set);
    }

    register(implementation: any): Builder {
        return new Builder({
            implementation,
            add: this.add.bind(this),
        });
    }

    resolve<T>(key: (new (...args: any[]) => T)): T {
        const dependency = this.deps.get(key).values().next().value;

        return this.createInstance(dependency);
    }

    resolveAll<T>(key: (new (...args: any[]) => T)): T[] {
        const dependencies = this.deps.get(key);

        return Array.from(dependencies)
            .map((dependency: any) => this.createInstance(dependency));
    }

    private createInstance<T>(Dependency: (new (...args: any[]) => T)): T {
        const argTypes = Reflect.getMetadata('design:paramtypes', Dependency);
        const args = (argTypes || []).map((type: any, index: number) => {
            const metadata = Reflect.getMetadata(index, Dependency);

            return metadata || IoC._instance.resolve(type);
        });

        return new Dependency(...args);
    }
}
