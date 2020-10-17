import { Dom } from '~/core/dom';
import { Logger } from '~/core/logger';

export class Handler {
    constructor(
        protected _url: string,
        protected _dom: Dom,
        protected _logger: Logger,
    ) { }

    canHandle(url: string): boolean {
        return this._url === url;
    }

    tryToFollowOnProfile(): boolean {
        throw new Error('Not Implemented.');
    }

    tryToFollowOnFollowersList(): boolean {
        throw new Error('Not Implemented.');
    }

    getProfilesLinks(): string[] {
        throw new Error('Not Implemented.');
    }

    verifyAuthorization() {
        if (!this._isAuthorized()) {
            throw new Error(`${this._url}: Not authorized.`);
        }

        this._logger.warn(this, 'authorized');
    }

    protected _isAuthorized(): boolean {
        throw new Error('Not Implemented.');
    }
}
