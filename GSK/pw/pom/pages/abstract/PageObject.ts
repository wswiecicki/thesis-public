import { Page as PlaywrightPage, Locator } from 'playwright';

export abstract class PageObject {
    constructor(public readonly host: Locator) {}
}

export abstract class Page {
    constructor(public readonly page: PlaywrightPage) {}
    async close() {
        await this.page.close();
    }
}
