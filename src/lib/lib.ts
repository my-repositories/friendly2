import { Handler } from '~/core/handler';
import { IoC } from '~/ioc/container';
import { inject } from '~/ioc/decorators/inject';
import { injectable } from '~/ioc/decorators/injectable';

@injectable()
export class Lib {
    constructor(
        @inject(IoC.instance.resolveAll(Handler))
        private _handlers: Handler[],
    ) {
    }

    findHandlerByUrl(url: string): Handler {
        const handler: Handler = this._handlers.find((h: Handler) => h.canHandle(url));

        if (!handler) {
            throw new Error(`Handler not found. Current url: ${url}.`);
        }

        console.info(handler, 'Handler found!');

        return handler;
    }
}
