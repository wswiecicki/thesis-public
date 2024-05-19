import { Locator } from 'playwright';

export abstract class ComponentObject {
    constructor(public readonly parent: Locator) {}
}
