import { AsyncCommand } from 'fast-check';
import { Page } from 'playwright';
import { expect } from 'vitest';
import { getPlayableColumns, getCurrentGrid, performMoveAt, calculateGridDifference } from '../helpers/helpers';

export class PlayIllegalMove implements AsyncCommand<TestModel, Page, true> {
    constructor(private colId: number) {}

    async check(model: TestModel) {
        const columns = await getPlayableColumns(model.page);
        return !columns[this.colId];
    }

    async run(model: TestModel, page: Page) {
        const previousGrid = await getCurrentGrid(page);
        await performMoveAt(page, this.colId);

        expect(calculateGridDifference(previousGrid, await getCurrentGrid(page))).toEqual([]);
    }

    toString(): string {
        return `play illegal move at column ${this.colId}`;
    }
}
