import { Lib } from '~/lib/lib';

export class LibMock extends Lib {
    findHandlerByUrl = jest.fn();
    delay = jest.fn();
    getRandomInRange = jest.fn();
}
