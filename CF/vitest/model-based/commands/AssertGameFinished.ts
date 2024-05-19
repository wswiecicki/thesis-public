import { AsyncCommand } from 'fast-check';
import { Page } from 'playwright';
import { expect } from 'vitest';
import { getCurrentGrid, getInstructionsText, getPlayableColumns } from '../helpers/helpers';

export class AssertGameFinished implements AsyncCommand<TestModel, Page, true> {
    async check(model: TestModel) {
        const cols = await getPlayableColumns(model.page);
        return !cols.includes(true);
    }

    async run(m: TestModel, page: Page) {
        const previous = m.currentPlayer === 0 ? 1 : 0;
        const currentGrid = await getCurrentGrid(page);
        const instructionsText = await getInstructionsText(page);
        const previousWonInstruction = `Player #${previous + 1} won`;
        const currentTurnInstruction = `Player #${m.currentPlayer + 1} turn`;

        if (this.isGridFull(currentGrid)) {
            expect([currentTurnInstruction, previousWonInstruction]).toContain(instructionsText);
        } else {
            expect(instructionsText).toEqual(previousWonInstruction);
        }
    }

    toString(): string {
        return 'assert game finished';
    }

    isGridFull(grid: PlayerOrEmpty[][]) {
        return grid.every((column) => column.every((cell) => cell !== null));
    }
}
