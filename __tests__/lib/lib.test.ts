import { Dom } from '~/core/dom';
import { GithubHandler } from '~/handlers/github.handler';
import { HabrCareer } from '~/handlers/habr-career.handler';
import { Lib } from '~/lib/lib';
import { Logger } from '~/core/logger';

describe(`${Lib.name} - Класс с полезными методами:`, () => {
    describe('Метод findHandlerByUrl:', () => {
        it('возвращает githubHandler', () => {
            const githubHandler = new GithubHandler(new Dom(), new Logger());
            const handlers = [
                githubHandler,
            ];

            const app = new Lib(handlers, new Logger());

            expect(app.findHandlerByUrl('https://github.com')).toEqual(githubHandler);
        });

        it('бросает исключение', () => {
            const habrCareer = new HabrCareer(new Dom(), new Logger());
            const handlers = [
                habrCareer,
            ];

            const app = new Lib(handlers, new Logger());

            expect(() => app.findHandlerByUrl('https://github.com'))
                .toThrow('Handler not found. Current url: https://github.com.');
        });
    });
});
