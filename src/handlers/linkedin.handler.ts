import { Dom } from '~/core/dom';
import { Handler } from '~/core/handler';
import { Logger } from '~/core/logger';
import { injectable } from '~/ioc/decorators/injectable';

@injectable()
export class LinkedInHandler extends Handler {
    constructor(
        dom: Dom,
        logger: Logger,
    ) {
        super(
            'https://www.linkedin.com',
            dom,
            logger,
        );
    }

    tryToFollowOnProfile(): boolean {
        return this._tryToClickFirstFollowButton('.pv-top-card .pv-s-profile-actions--connect');
    }

    tryToFollowOnFollowersList(): boolean {
        return this._tryToClickFirstFollowButton(
            '.browsemap .pv-s-profile-actions--connect, .pv-pymk-section__member-cta-button',
        );
    }

    getProfilesLinks(): string[] {
        return this._dom
            .findAllElements<HTMLAnchorElement>('.pv-browsemap-section__member, .pv-pymk-section__member')
            .map((link) => link.href);
    }

    protected _isAuthorized(): boolean {
        return !!this._dom.findElement('.global-nav__me');
    }

    protected _closeVerificationPopup(): void {
        const element = this._dom
            .findElement<HTMLButtonElement>('.artdeco-modal__actionbar .artdeco-button--primary');

        if (element) {
            element.click();
        }
    }
}
