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
            'https://career.habr.com',
            dom,
            logger,
        );
    }

    get minimalTimeoutPerRequest() {
        return 10 * 1000;
    }

    tryToFollowOnProfile(): boolean {
        return this._tryToClickFirstFollowButton('.user_info .add_to_friends');
    }

    tryToFollowOnFollowersList(): boolean {
        return this._tryToClickFirstFollowButton('.user_friends .add_to_friends');
    }

    getProfilesLinks(): string[] {
        return this._dom.findAllElements<HTMLAnchorElement>('.user_friends_item .avatar a')
            .filter((link) => link.parentNode.parentNode.querySelector('.friendship_button .add_to_friends'))
            .map((link) => link.href + '/friends');
    }

    protected _isAuthorized(): boolean {
        return !this._dom.findElement('.header__sign_in');
    }
}
