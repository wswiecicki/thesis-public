import { test, expect } from 'vitest';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import { Board } from '../../connect-four-react/src/components/Board';
import { emptyGrid } from '../../connect-four-react/src/redux/reducers/grid';

export const TestGridWidth = 10;
export const TestGridHeight = 10;

export enum Player {
    None = '',
    PlayerA = '1',
    PlayerB = '2',
}

const pArbitrary = fc.constantFrom(Player.PlayerA, Player.PlayerB);
const pNoneArbitrary = fc.constantFrom(Player.None, Player.PlayerA, Player.PlayerB);
const gArbitrary = fc
    .tuple(
        ...Array.from({ length: TestGridWidth }, () =>
            fc.array(pArbitrary, { minLength: 0, maxLength: TestGridHeight })
        )
    )
    .map((gr) =>
        gr.reduceRight(
            (grid, column, i) =>
                column.reduceRight((grid, player, j) => {
                    grid[TestGridHeight - j - 1][i] = player;
                    return grid;
                }, grid),
            emptyGrid(TestGridWidth, TestGridHeight)
        )
    );

test('Board should render the correct number of columns for any correct grid', () =>
    fc.assert(
        fc.property(
            fc
                .tuple(fc.integer({ min: 1, max: 50 }), fc.integer({ min: 1, max: 50 }))
                .chain(([width, height]) =>
                    fc
                        .array(pNoneArbitrary, { minLength: width * height, maxLength: width * height })
                        .map((cells) =>
                            Array.from({ length: height }, (_, i) => cells.slice(i * width, (i + 1) * width))
                        )
                ),
            pArbitrary,
            fc.boolean(),
            (grid, currentPlayer, done) => {
                const { container } = render(<Board grid={grid} currentPlayer={currentPlayer} done={done} />);
                const columns = container.getElementsByClassName('board-column');
                expect(columns.length).toBe(grid[0].length);
            }
        )
    ));

test('Board should render playable columns when they are not full or game not finished', () =>
    fc.assert(
        fc.property(gArbitrary, pArbitrary, fc.boolean(), (grid, currentPlayer, done) => {
            const { container } = render(<Board grid={grid} currentPlayer={currentPlayer} done={done} />);
            const columns = container.getElementsByClassName('board-column');
            Array.from(columns).forEach((column, idx) => {
                const isFullColumn = grid[0][idx] !== Player.None;
                const expectedPlayable = !done && !isFullColumn ? 'playable' : 'not-playable';
                const actualPlayable = Array.from(column.classList);
                expect(actualPlayable).toContain(expectedPlayable);
            });
        })
    ));
