import { injectable } from '~/ioc/decorators/injectable';

@injectable()
export class Dom {
    getCurrentOrigin() {
        return document.location.origin;
    }

    findElement(selector: string): Element {
        return document.querySelector(selector);
    }

    findAllElements(selector: string): Element[] {
        return Array.from(document.querySelectorAll(selector));
    }

    navigateTo(url: string): void {
        window.location.href = url;
    }
}
