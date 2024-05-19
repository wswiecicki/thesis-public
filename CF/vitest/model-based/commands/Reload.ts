import { AsyncCommand } from 'fast-check';
import { Page } from 'playwright';
import { expect } from 'vitest';
import { calculateGridDifference, getCurrentGrid } from '../helpers/helpers';

export class Reload implements AsyncCommand<TestModel, Page> {
    check(model: TestModel) {
        return true;
    }

    async run(model: TestModel, page: Page) {
        const previousGrid = await getCurrentGrid(page);
        await page.reload();

        const newGrid = await getCurrentGrid(page);
        expect(calculateGridDifference(previousGrid, newGrid)).toEqual([]);
    }

    toString(): string {
        return 'reload';
    }
}
