export function inject(value: any) {
    return function(target: any, targetKey: string, index?: number): void {
        Reflect.defineMetadata(index, value, target);
    };
}
