import { Dom } from '~/core/dom';

export class DomMock extends Dom {
    findElement = jest.fn();
    findAllElements = jest.fn();
    getCurrentOrigin = jest.fn();
    navigateTo = jest.fn();
}
