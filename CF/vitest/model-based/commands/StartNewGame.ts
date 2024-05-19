import { AsyncCommand } from 'fast-check';
import { Page } from 'playwright';
import { expect } from 'vitest';
import { getCurrentGrid, calculateGridDifference } from '../helpers/helpers';

export class StartNewGame implements AsyncCommand<TestModel, Page> {
    check() {
        return true;
    }

    async run(model: TestModel, page: Page) {
        const oldGrid = await getCurrentGrid(page);
        await this.performStartNewGame(page);

        const newGrid = await getCurrentGrid(page);
        const newEmptyGrid = this.getEmptyGrid(oldGrid[0].length, oldGrid.length);
        expect(calculateGridDifference(newEmptyGrid, newGrid)).toEqual([]);
    }

    toString(): string {
        return 'start new game';
    }

    async performStartNewGame(page: Page) {
        await page.locator('#new-game-button').click();
    }

    getEmptyGrid(r: number, c: number): PlayerOrEmpty[][] {
        return Array.from({ length: c }, () => Array.from({ length: r }, () => null));
    }
}
