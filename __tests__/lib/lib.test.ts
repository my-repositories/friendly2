import { Dom } from '~/core/dom';
import { GithubHandler } from '~/handlers/github.handler';
import { HabrCareer } from '~/handlers/habr-career.handler';
import { Lib } from '~/lib/lib';

describe(`${Lib.name} - Класс с полезными методами:`, () => {
    describe('метод findHandlerByUrl:', () => {
        it('возвращает githubHandler', () => {
            const githubHandler = new GithubHandler(new Dom());
            const handlers = [
                githubHandler,
            ];

            const app = new Lib(handlers);

            expect(app.findHandlerByUrl('https://github.com')).toEqual(githubHandler);
        });

        it('бросает исключение', () => {
            const habrCareer = new HabrCareer(new Dom());
            const handlers = [
                habrCareer,
            ];

            const app = new Lib(handlers);

            expect(() => app.findHandlerByUrl('https://github.com'))
                .toThrow('Handler not found. Current url: https://github.com.');
        });
    });
});
