import { GithubHandler } from '~/handlers/github.handler';

export class GithubHandlerMock extends GithubHandler {
    canHandle = jest.fn();
    verifyAuthorization = jest.fn();
    tryToFollowOnProfile = jest.fn();
    tryToFollowOnFollowersList = jest.fn();
    getProfilesLinks = jest.fn();
}
