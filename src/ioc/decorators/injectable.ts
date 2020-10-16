import 'reflect-metadata';
import { IoC } from '~/ioc/container';

export function injectable() {
    return inject;
}

function inject(target: any) {
    registerTarget(target);

    return target;
}

function registerTarget(target: any) {
    const proto = Object.getPrototypeOf(target);

    if (proto && proto.name) {
        IoC.instance
            .register(target)
            .as(proto);
    } else {
        IoC.instance
            .register(target)
            .asSelf();
    }
}
