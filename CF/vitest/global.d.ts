import type { Page } from 'playwright';

declare global {
    type PlayerNumber = 0 | 1;
    type PlayerOrEmpty = PlayerNumber | null;
    type TestModel = {
        currentPlayer: PlayerNumber;
        page: Page;
        history: { [url: string]: { grid: PlayerOrEmpty[][]; player: PlayerNumber } };
    };
}
export {};
