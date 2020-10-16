import { Dom } from '~/core/dom';
import { Handler } from '~/core/handler';
import { injectable } from '~/ioc/decorators/injectable';

@injectable()
export class HabrCareer extends Handler {
    constructor(dom: Dom) {
        super('habr.career', dom);
    }

    _isAuthorized(): boolean {
        return false;
    }
}
