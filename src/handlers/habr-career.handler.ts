import { Dom } from '~/core/dom';
import { Handler } from '~/core/handler';
import { Logger } from '~/core/logger';
import { injectable } from '~/ioc/decorators/injectable';

@injectable()
export class HabrCareer extends Handler {
    constructor(
        dom: Dom,
        logger: Logger,
    ) {
        super(
            'habr.career',
            dom,
            logger,
        );
    }

    protected _isAuthorized(): boolean {
        return false;
    }
}
