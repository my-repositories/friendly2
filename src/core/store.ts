import { injectable } from '~/ioc/decorators/injectable';

@injectable()
export class Store {
    private static _linksKey = '__STORE__LINKS__';
    private static _maxLinksCount = 500;

    get(): string[] {
        return JSON.parse(sessionStorage.getItem(Store._linksKey) || '[]');
    }

    save(newLinks: string[]): void {
        if (!newLinks || !newLinks.length) {
            return;
        }

        const storageLinks = this.get();
        const mergedLinks = new Set([
            ...newLinks,
            ...storageLinks,
        ]);
        const data = Array.from(mergedLinks).slice(0, Store._maxLinksCount);

        sessionStorage.setItem(Store._linksKey, JSON.stringify(data));
    }

    reset(): void {
        sessionStorage.setItem(Store._linksKey, JSON.stringify('[]'));
    }
}
