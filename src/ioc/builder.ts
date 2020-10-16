import { BuilderParams } from './interfaces/builder-params';

export class Builder {
    constructor(private params: BuilderParams) {
    }

    as(type: any) {
        this.params.add(type, this.params.implementation);
    }

    asSelf() {
        this.params.add(this.params.implementation, this.params.implementation);
    }
}
