import { AsyncCommand } from 'fast-check';
import { Page } from 'playwright';
import { expect } from 'vitest';
import { getCurrentGrid, calculateGridDifference } from '../helpers/helpers';

export class OpenHistoryUrl implements AsyncCommand<TestModel, Page> {
    private url: string = 'undefined url';

    constructor(private id: number) {}

    check(model: TestModel) {
        return Object.keys(model.history).length > 0;
    }

    async run(model: TestModel, page: Page) {
        const historyUrls = Object.keys(model.history);
        this.url = historyUrls[this.id % historyUrls.length];
        await page.goto(this.url);

        const newGrid = await getCurrentGrid(page);
        expect(calculateGridDifference(model.history[this.url].grid, newGrid)).toHaveLength(0);
        model.currentPlayer = model.history[this.url].player;
    }

    toString(): string {
        return `open history url: ${this.url}`;
    }
}
