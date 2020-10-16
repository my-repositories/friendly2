import { Dom } from '~/core/dom';

export class Handler {
    constructor(
        protected _url: string,
        protected _dom: Dom,
    ) { }

    canHandle(url: string): boolean {
        return this._url === url;
    }

    verifyAuthorization() {
        if (!this._isAuthorized()) {
            throw new Error(`${this._url}: Not authorized.`);
        }

        console.info(this, 'authorized');
    }

    protected _isAuthorized(): boolean {
        throw new Error('Not Implemented.');
    }
}
