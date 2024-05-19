import { AsyncCommand } from 'fast-check';
import { isRedoEnabled, isUndoEnabled, calculateGridDifference, getCurrentGrid, performUndo } from '../helpers/helpers';
import { Page } from 'playwright';
import { expect } from 'vitest';

export class Undo implements AsyncCommand<TestModel, Page, true> {
    async check(model: TestModel) {
        const grid = await getCurrentGrid(model.page);
        return !this.isGridEmpty(grid);
    }

    async run(model: TestModel, page: Page) {
        const previousGrid = await getCurrentGrid(page);
        expect(await isUndoEnabled(page)).toBe(true);
        await performUndo(page);

        const newGrid = await getCurrentGrid(page);
        const diff = calculateGridDifference(previousGrid, newGrid);
        expect(diff).toHaveLength(1);
        expect(await isRedoEnabled(page)).toBe(true);

        model.currentPlayer = model.currentPlayer === 0 ? 1 : 0;
    }

    toString(): string {
        return 'undo';
    }

    isGridEmpty(grid: PlayerOrEmpty[][]) {
        return grid.every((row) => row.every((cell) => cell === null));
    }
}
