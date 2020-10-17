import { Store } from '~/core/store';

describe(`${Store.name} - Класс для работы с хранилищем ссылок:`, () => {
    const linksKey = '__STORE__LINKS__';
    const maxLinksCount = 500;

    beforeEach(() => {
        jest.spyOn(window.sessionStorage.__proto__, 'setItem');
        window.sessionStorage.__proto__.setItem = jest.fn();
        jest.spyOn(window.sessionStorage.__proto__, 'getItem');
        window.sessionStorage.__proto__.getItem = jest.fn();
    });

    it('метод reset очищает хранилище', () => {
        const store = new Store();

        jest.spyOn(window.sessionStorage.__proto__, 'setItem');
        window.sessionStorage.__proto__.setItem = jest.fn();

        store.reset();

        expect(localStorage.setItem).toHaveBeenCalledWith(linksKey, '[]');
    });

    describe('Метод get:', () => {
        it('вызывает localStorage.getItem с ключом linksKey', () => {
            const store = new Store();

            store.get();

            expect(localStorage.getItem).toHaveBeenCalledWith(linksKey);
        });

        it('по умолчанию возвращает пустой массив', () => {
            const store = new Store();

            expect(store.get()).toEqual([]);
        });
    });

    describe('Метод save:', () => {
        it('не вызывает localStorage.setItem, если передать пустой массив', () => {
            const store = new Store();

            store.save([]);

            expect(localStorage.setItem).not.toHaveBeenCalled();
        });

        it('вызывает localStorage.setItem с переданными ссылками', () => {
            const store = new Store();
            const links = ['link1', 'link2'];

            store.save(links);

            expect(localStorage.setItem).toHaveBeenCalledWith(linksKey, JSON.stringify(links));
        });

        it('вызывает localStorage.setItem только с уникальными ссылками', () => {
            const store = new Store();
            const links = ['link2', 'link3', 'link1', 'link3', 'link1'];

            store.save(links);

            expect(localStorage.setItem)
                .toHaveBeenCalledWith(linksKey, JSON.stringify(['link2', 'link3', 'link1']));
        });

        it('объединяет ссылки', () => {
            const store = new Store();
            const savedLinks = ['link1', 'link2', 'link4'];
            const newLinks = ['link3', 'link4', 'link1'];
            window.sessionStorage.__proto__.getItem.mockReturnValue(JSON.stringify(savedLinks));

            store.save(newLinks);

            expect(localStorage.setItem)
                .toHaveBeenCalledWith(linksKey, JSON.stringify(['link3', 'link4', 'link1', 'link2']));
        });


        it(`сохраняет максимум ${maxLinksCount} ссылок, остальные отбрасывает`, () => {
            const store = new Store();
            const savedLinks = Array.from(Array(542).keys()).map((x) => x.toString());
            const newLinks = ['link3', 'link4', 'link1'];
            const expectedArray = ['link3', 'link4', 'link1'].concat(savedLinks).slice(0, maxLinksCount);
            window.sessionStorage.__proto__.getItem.mockReturnValue(JSON.stringify(savedLinks));

            store.save(newLinks);

            expect(localStorage.setItem).toHaveBeenCalledWith(linksKey, JSON.stringify(expectedArray));
        });
    });
});
