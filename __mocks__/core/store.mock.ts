import { Store } from '~/core/store';

export class StoreMock extends Store {
    get = jest.fn();
    save = jest.fn();
    reset = jest.fn();
}
