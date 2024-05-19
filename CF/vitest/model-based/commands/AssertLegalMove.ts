import { AsyncCommand } from 'fast-check';
import { Page } from 'playwright';
import { expect } from 'vitest';
import { getInstructionsText, getPlayableColumns } from '../helpers/helpers';

export class AssertLegalMove implements AsyncCommand<TestModel, Page, true> {
    async check(model: TestModel) {
        const columns = await getPlayableColumns(model.page);
        return columns.includes(true);
    }
    async run(model: TestModel, page: Page) {
        const label = await getInstructionsText(page);
        expect(label).toEqual(`Player #${model.currentPlayer + 1} turn`);
    }
    toString(): string {
        return 'assert legal move';
    }
}
