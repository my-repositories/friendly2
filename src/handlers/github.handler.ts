import { Dom } from '~/core/dom';
import { Handler } from '~/core/handler';
import { injectable } from '~/ioc/decorators/injectable';

@injectable()
export class GithubHandler extends Handler {
    constructor(dom: Dom) {
        super('https://github.com', dom);
    }

    _isAuthorized(): boolean {
        return !this._dom.findAllElements('header.js-details-container a')
            .map((a) => a.textContent.trim().toLowerCase().replace(/\s/g, ' '))
            .find((text) => text === 'sign up' || text === 'sign in');
    }
}
