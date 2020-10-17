import { Logger } from '~/core/logger';

export class LoggerMock extends Logger {
    error = jest.fn();
    warn = jest.fn();
}
