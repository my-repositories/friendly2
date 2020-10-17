import { Dom } from '~/core/dom';
import { Handler } from './core/handler';
import { Lib } from '~/lib/lib';
import { Logger } from '~/core/logger';
import { Store } from '~/core/store';
import { injectable } from '~/ioc/decorators/injectable';

@injectable()
export class Main {
    private _handler: Handler;
    private _nextLink: string;

    constructor(
        private _logger: Logger,
        private _lib: Lib,
        private _dom: Dom,
        private _store: Store,
    ) { }

    init(): void {
        this._handler = this._lib.findHandlerByUrl(this._dom.getCurrentOrigin());
        this._handler.verifyAuthorization();
    }

    loadLinks(): void {
        const links = this._getLinks();

        if (links.length) {
            this._nextLink = links.pop();
            this._store.save(links);
        }
    }

    tryToFollowOnProfile(): void {
        this._handler.tryToFollowOnProfile();
    }

    async tryToFollowOnFollowersList(): Promise<void> {
        while (this._handler.tryToFollowOnFollowersList()) {
            const timeout = Math.floor(this._lib.getRandomInRange(999, 1987));

            await this._lib.delay(timeout);
        }
    }

    async openNextLink(): Promise<void> {
        await this._lib.delay(101 * this._lib.getRandomInRange(21, 42));

        if (this._nextLink) {
            this._dom.navigateTo(this._nextLink);
        } else {
            this._logger.error('There is no next link. The job is finished!');
        }
    }

    private _getLinks(): string[] {
        const links = this._handler.getProfilesLinks();

        return links.length
            ? links
            : this._store.get();
    }
}
