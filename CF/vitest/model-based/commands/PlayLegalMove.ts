import { AsyncCommand } from 'fast-check';
import { Page } from 'playwright';
import { expect } from 'vitest';
import { getPlayableColumns, getCurrentGrid, performMoveAt, calculateGridDifference } from '../helpers/helpers';

export class PlayLegalMove implements AsyncCommand<TestModel, Page, true> {
    constructor(private colId: number) {}

    async check(model: TestModel) {
        const playableColumns = await getPlayableColumns(model.page);
        return playableColumns[this.colId];
    }

    async run(model: TestModel, page: Page) {
        const previousGrid = await getCurrentGrid(page);
        await performMoveAt(page, this.colId);

        const newGrid = await getCurrentGrid(page);

        const diffs = calculateGridDifference(previousGrid, newGrid);
        expect(diffs).toHaveLength(1);
        expect(diffs[0].col).toBe(this.colId);
        expect(diffs[0].gridA).toBe(null);
        expect(diffs[0].gridB, 'player assertion').toBe(model.currentPlayer);

        model.currentPlayer = model.currentPlayer === 0 ? 1 : 0;
    }

    toString(): string {
        return `play legal move at column ${this.colId}`;
    }
}
