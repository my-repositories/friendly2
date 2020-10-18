import { injectable } from '~/ioc/decorators/injectable';

@injectable()
export class Dom {
    getCurrentOrigin() {
        return document.location.origin;
    }

    findElement<T extends Element>(selector: string): T {
        return document.querySelector(selector);
    }

    findAllElements<T extends Element>(selector: string): T[] {
        return Array.from(document.querySelectorAll(selector));
    }

    navigateTo(url: string): void {
        window.location.href = url;
    }
}
