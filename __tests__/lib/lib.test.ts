import { DomMock } from '~/mocks/core/dom.mock';
import { GithubHandler } from '~/handlers/github.handler';
import { HabrCareer } from '~/handlers/habr-career.handler';
import { Lib } from '~/lib/lib';
import { LoggerMock } from '~/mocks/core/logger.mock';

describe(`${Lib.name} - Класс с полезными методами:`, () => {
    describe('Метод findHandlerByUrl:', () => {
        it('возвращает githubHandler', () => {
            const githubHandler = new GithubHandler(new DomMock(), new LoggerMock());
            const handlers = [
                githubHandler,
            ];

            const app = new Lib(handlers, new LoggerMock());

            expect(app.findHandlerByUrl('https://github.com')).toEqual(githubHandler);
        });

        it('бросает исключение', () => {
            const habrCareer = new HabrCareer(new DomMock(), new LoggerMock());
            const handlers = [
                habrCareer,
            ];

            const app = new Lib(handlers, new LoggerMock());

            expect(() => app.findHandlerByUrl('https://github.com'))
                .toThrow('Handler not found. Current url: https://github.com.');
        });
    });
});
