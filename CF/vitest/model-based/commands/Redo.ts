import { AsyncCommand } from 'fast-check';
import { isRedoEnabled, isUndoEnabled, calculateGridDifference, getCurrentGrid, performRedo } from '../helpers/helpers';
import { Page } from 'playwright';
import { expect } from 'vitest';

export class Redo implements AsyncCommand<TestModel, Page, true> {
    async check(model: TestModel) {
        return await isRedoEnabled(model.page);
    }

    async run(model: TestModel, page: Page) {
        const previousGrid = await getCurrentGrid(page);
        await performRedo(page);

        const newGrid = await getCurrentGrid(page);
        const differences = calculateGridDifference(previousGrid, newGrid);
        expect(differences).toHaveLength(1);
        expect(await isUndoEnabled(page)).toBe(true);

        model.currentPlayer = model.currentPlayer === 0 ? 1 : 0;
    }
    toString(): string {
        return 'redo';
    }
}
