import { DomMock } from '~/mocks/core/dom.mock';
import { GithubHandlerMock } from '~/mocks/handlers/github.handler.mock';
import { LibMock } from '~/mocks/lib/lib.mock';
import { LoggerMock } from '~/mocks/core/logger.mock';
import { Main } from '~/main';
import { StoreMock } from '~/mocks/core/store.mock';

describe(`${Main.name} - Класс приложения:`, () => {
    let main: Main;
    let dom: DomMock;
    let logger: LoggerMock;
    let lib: LibMock;
    let store: StoreMock;
    let githubHandler: GithubHandlerMock;

    beforeEach(() => {
        dom = new DomMock();
        dom.getCurrentOrigin.mockReturnValue('https://github.com');
        dom.findAllElements.mockReturnValue([]);

        logger = new LoggerMock();
        store = new StoreMock();
        logger = new LoggerMock();
        logger = new LoggerMock();

        githubHandler = new GithubHandlerMock(dom, logger);

        lib = new LibMock([githubHandler], logger);
        lib.findHandlerByUrl.mockReturnValue(githubHandler);

        main = new Main(
            logger,
            lib,
            dom,
            store,
        );
        main.init();
    });

    describe('Метод init:', () => {
        it('вызывает lib.findHandlerByUrl', () => {
            expect(lib.findHandlerByUrl).toHaveBeenCalledWith('https://github.com');
        });

        it('вызывает githubHandler.verifyAuthorization', () => {
            expect(githubHandler.verifyAuthorization).toHaveBeenCalled();
        });
    });

    it('метод tryToFollowOnProfile вызывает githubHandler.tryToFollowOnProfile', () => {
        main.tryToFollowOnProfile();

        expect(githubHandler.tryToFollowOnProfile).toHaveBeenCalled();
    });

    describe('Метод tryToFollowOnFollowersList:', () => {
        it('вызывает githubHandler.tryToFollowOnFollowersList', () => {
            main.tryToFollowOnFollowersList();
            expect(githubHandler.tryToFollowOnFollowersList).toHaveBeenCalled();
        });

        describe('githubHandler.tryToFollowOnFollowersList вернул true:', () => {
            beforeEach(() => {
                githubHandler.tryToFollowOnFollowersList.mockReturnValue(true);
            });

            it('вызывает lib.getRandomInRange', () => {
                main.tryToFollowOnFollowersList();
                expect(lib.getRandomInRange).toHaveBeenCalledWith(999, 1987);
            });

            it('вызывает lib.delay', () => {
                main.tryToFollowOnFollowersList();
                expect(lib.delay).toHaveBeenCalled();
            });
        });

        describe('githubHandler.tryToFollowOnFollowersList вернул false:', () => {
            beforeEach(() => {
                githubHandler.tryToFollowOnFollowersList.mockReturnValue(false);
            });

            it('не вызывает lib.getRandomInRange', () => {
                main.tryToFollowOnFollowersList();
                expect(lib.getRandomInRange).not.toHaveBeenCalled();
            });

            it('не вызывает lib.delay', () => {
                main.tryToFollowOnFollowersList();
                expect(lib.delay).not.toHaveBeenCalled();
            });
        });
    });
});
