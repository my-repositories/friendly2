import { Dom } from '~/core/dom';
import { Lib } from '~/lib/lib';
import { injectable } from '~/ioc/decorators/injectable';

@injectable()
export class Main {
    constructor(
        private _lib: Lib,
        private _dom: Dom,
    ) { }

    run() {
        try {
            const handler = this._lib.findHandlerByUrl(this._dom.getCurrentOrigin());
            handler.verifyAuthorization();

            console.info(this, 'finish!');
        } catch (e) {
            console.error(e);
        }
    }
}
