import { Locator, Page } from 'playwright';

export async function isUndoEnabled(page: Page) {
    return await page.locator('#undo-button').isEnabled();
}

export async function performUndo(page: Page) {
    await page.locator('#undo-button').click();
}

export async function isRedoEnabled(page: Page) {
    return await page.locator('#redo-button').isEnabled();
}

export async function performRedo(page: Page) {
    await page.locator('#redo-button').click();
}

export async function getInstructionsText(page: Page) {
    return ((await page.locator('.instructions').textContent()) || '').trim();
}

export async function getPlayableColumns(page: Page) {
    const columns = await page.locator('.board-column').all();
    return Promise.all(
        columns.map(async (col) => {
            return (await col.getAttribute('class'))?.includes('playable') || false;
        })
    );
}

export async function getCurrentGrid(page: Page) {
    return page.evaluate(() => {
        const grid = [];
        const columns = Array.from(document.getElementsByClassName('board-column'));

        for (const col of columns) {
            const tokensEl = Array.from(col.getElementsByClassName('board-cell'));
            const tokens = tokensEl.map((el) => {
                if (el.className.includes('player-1')) return 0;
                if (el.className.includes('player-2')) return 1;
                return null;
            });
            grid.push(tokens);
        }
        return grid;
    });
}

export async function performMoveAt(page: Page, columnId: number) {
    const columns = await page.locator('.board-column').all();
    await columns[columnId].click();
}

export function calculateGridDifference(
    gridA: PlayerOrEmpty[][],
    gridB: PlayerOrEmpty[][]
): { row: number; col: number; gridA: PlayerOrEmpty; gridB: PlayerOrEmpty }[] {
    return gridA.flatMap((column, colIndex) =>
        column.reduce((acc, cellA, rowIndex) => {
            const cellB = gridB[colIndex]?.[rowIndex];
            if (cellA !== cellB) {
                acc.push({
                    col: colIndex,
                    row: rowIndex,
                    gridA: cellA,
                    gridB: cellB,
                });
            }
            return acc;
        }, [] as { row: number; col: number; gridA: PlayerOrEmpty; gridB: PlayerOrEmpty }[])
    );
}
