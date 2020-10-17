import { injectable } from '~/ioc/decorators/injectable';

@injectable()
export class Logger {
    private static _options = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };

    private static _streams = {
        STDOUT: console.warn,
        STDERR: console.error,
    };

    error(...args: any) {
        this._log(Logger._streams.STDERR, args);
    }

    warn(...args: any) {
        this._log(Logger._streams.STDOUT, args);
    }

    // noinspection JSMethodCanBeStatic
    private _log(stream: Function, args: any) {
        const datetime = (new Date()).toLocaleString('ru', Logger._options);
        const prefix = `[${datetime}]:`;

        stream.call(console, prefix, ...args);
    }
}
