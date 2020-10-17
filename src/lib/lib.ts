import { Handler } from '~/core/handler';
import { IoC } from '~/ioc/container';
import { Logger } from '~/core/logger';
import { inject } from '~/ioc/decorators/inject';
import { injectable } from '~/ioc/decorators/injectable';

@injectable()
export class Lib {
    constructor(
        @inject(IoC.instance.resolveAll(Handler))
        private _handlers: Handler[],
        private _logger: Logger,
    ) {
    }

    findHandlerByUrl(url: string): Handler {
        const handler: Handler = this._handlers.find((h: Handler) => h.canHandle(url));

        if (!handler) {
            throw new Error(`Handler not found. Current url: ${url}.`);
        }

        this._logger.warn(handler, 'Handler found!');

        return handler;
    }

    delay(milliseconds: number) {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }

    getRandomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }
}
