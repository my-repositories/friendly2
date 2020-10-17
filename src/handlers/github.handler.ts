import { Dom } from '~/core/dom';
import { Handler } from '~/core/handler';
import { Logger } from '~/core/logger';
import { injectable } from '~/ioc/decorators/injectable';

@injectable()
export class GithubHandler extends Handler {
    constructor(
        dom: Dom,
        logger: Logger,
    ) {
        super(
            'https://github.com',
            dom,
            logger,
        );
    }

    tryToFollowOnProfile(): boolean {
        return this._tryToClickFirstFollowButton('.h-card .js-form-toggle-target input[type=submit][value=Follow]');
    }

    tryToFollowOnFollowersList(): boolean {
        return this._tryToClickFirstFollowButton(
            '.position-relative .js-form-toggle-target input[type=submit][value=Follow]',
        );
    }

    getProfilesLinks(): string[] {
        const linkNodes = <HTMLLinkElement[]>[
            ...document.querySelectorAll('.position-relative a[data-hovercard-type="user"]'),
        ];
        return linkNodes
            .filter((link) => link.classList.contains('no-underline'))
            .filter((link) => {
                return link.parentNode
                    .parentNode
                    .querySelector('form[hidden] input[type=submit][value=Unfollow]');
            })
            .map((link) => link.href);
    }

    protected _isAuthorized(): boolean {
        return !this._dom.findAllElements('header.js-details-container a')
            .map((a) => a.textContent.trim().toLowerCase().replace(/\s/g, ' '))
            .find((text) => text === 'sign up' || text === 'sign in');
    }

    private _tryToClickFirstFollowButton(selector: string): boolean {
        const followButtons = <HTMLButtonElement[]>[
            ...document.querySelectorAll(selector),
        ]
            .filter((button) => !(button.parentNode as HTMLFormElement).hidden);

        if (followButtons.length) {
            followButtons[0].click();

            return true;
        }

        return false;
    }
}
