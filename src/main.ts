import { Dom } from '~/core/dom';
import { Handler } from './core/handler';
import { Lib } from '~/lib/lib';
import { Logger } from '~/core/logger';
import { Store } from '~/core/store';
import { injectable } from '~/ioc/decorators/injectable';

@injectable()
export class Main {
    private static _pageLoadTime = 5000;
    private _handler: Handler;
    private _nextLink: string;

    constructor(
        private _logger: Logger,
        private _lib: Lib,
        private _dom: Dom,
        private _store: Store,
    ) { }

    async init(): Promise<void> {
        await this._lib.delay(Main._pageLoadTime);
        this._handler = this._lib.findHandlerByUrl(this._dom.getCurrentOrigin());
        this._handler.verifyAuthorization();
    }

    loadLinks(): void {
        const links = this._getLinks();

        this._nextLink = links.pop();
        this._store.save(links);
        this._logger.warn('Save links:', links);
    }

    tryToFollowOnProfile(): void {
        this._handler.tryToFollowOnProfile();
    }

    async tryToFollowOnFollowersList(): Promise<void> {
        const min = this._handler.minimalTimeoutPerRequest + 21 * 101;
        const max = this._handler.minimalTimeoutPerRequest + 42 * 202;
        const timeout = Math.floor(this._lib.getRandomInRange(min, max));

        do {
            await this._lib.delay(timeout);
        }
        while (this._handler.tryToFollowOnFollowersList());
    }

    async openNextLink(): Promise<void> {
        await this._lib.delay(this._lib.getRandomInRange(21 * 101, 42 * 202));

        if (this._nextLink) {
            this._dom.navigateTo(this._nextLink);
        } else {
            this._logger.error('There is no next link. The job is finished!');
        }
    }

    private _getLinks(): string[] {
        const profilesLinks = this._handler.getProfilesLinks();

        if (profilesLinks.length) {
            return profilesLinks;
        }

        const storedLinks = this._store.get();
        this._store.reset();

        return storedLinks;
    }
}
