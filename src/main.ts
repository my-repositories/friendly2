import { Dom } from '~/core/dom';
import { Lib } from '~/lib/lib';
import { Logger } from '~/core/logger';
import { Store } from '~/core/store';
import { injectable } from '~/ioc/decorators/injectable';

@injectable()
export class Main {
    constructor(
        private _logger: Logger,
        private _lib: Lib,
        private _dom: Dom,
        private _store: Store,
    ) { }

    run() {
        try {
            const handler = this._lib.findHandlerByUrl(this._dom.getCurrentOrigin());
            handler.verifyAuthorization();
            handler.tryToFollowOnProfile();

            // while true
            handler.tryToFollowOnFollowersList();

            const links = handler.getProfilesLinks();
            console.warn({ profileLinks: links });

            // if (links.length) {
            //     console.warn('next link + ?tab=followers', links.pop());
            //     this._store.save(links);
            // } else {
            //     const storedLinks = this._store.get();
            //     console.warn('next link + ?tab=followers', storedLinks.pop());
            //     this._store.save(storedLinks);
            // }

            this._logger.warn(this, 'finish!');
        } catch (e) {
            this._logger.error(this, e);
        }
    }
}
