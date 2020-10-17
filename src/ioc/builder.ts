import { BuilderParams } from './interfaces/builder-params';

export class Builder {
    constructor(private _params: BuilderParams) {
    }

    as(type: any) {
        this._params.add(type, this._params.implementation);
    }

    asSelf() {
        this._params.add(this._params.implementation, this._params.implementation);
    }
}
