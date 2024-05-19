import { AsyncCommand } from 'fast-check';
import { Page } from 'playwright';
import { expect } from 'vitest';
import { getCurrentGrid } from '../helpers/helpers';

export class SaveUrlToHistory implements AsyncCommand<TestModel, Page> {
    private url?: string;

    check(model: TestModel) {
        return true;
    }

    async run(model: TestModel, page: Page) {
        const url = page.url();
        this.url = url;

        const h = { grid: await getCurrentGrid(page), player: model.currentPlayer };
        if (model.history[url]) {
            expect(model.history[url]).toEqual(h);
        }

        model.history[url] = h;
    }

    toString(): string {
        return `saving url to history: ${this.url}`;
    }
}
