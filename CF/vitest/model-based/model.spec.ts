import * as fc from 'fast-check';
import { chromium, Browser, Page } from 'playwright';
import { StartNewGame } from './commands/StartNewGame';
import { Reload } from './commands/Reload';
import { Undo } from './commands/Undo';
import { Redo } from './commands/Redo';
import { OpenHistoryUrl } from './commands/OpenHistoryUrl';
import { SaveUrlToHistory } from './commands/SaveUrlToHistory';
import { PlayLegalMove } from './commands/PlayLegalMove';
import { PlayIllegalMove } from './commands/PlayIllegalMove';
import { AssertLegalMove } from './commands/AssertLegalMove';
import { AssertGameFinished } from './commands/AssertGameFinished';
import { afterAll, beforeAll, describe, test } from 'vitest';

describe('Limited Model', () => {
    let browser: Browser;
    let page: Page;

    beforeAll(async () => {
        browser = await chromium.launch({ headless: false });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await page.close();
        await browser.close();
    });

    test('Playing with commands on UI', async () => {
        const commands = [
            fc.constant(new AssertGameFinished()),
            fc.constant(new AssertLegalMove()),
            fc.constant(new StartNewGame()),
            fc.constant(new Redo()),
            fc.constant(new Reload()),
            fc.nat().map((id) => new OpenHistoryUrl(id)),
            fc.constant(new SaveUrlToHistory()),
            fc.constant(new Undo()),
            fc.constant(new PlayLegalMove(0)),
            fc.constant(new PlayLegalMove(1)),
            fc.constant(new PlayLegalMove(2)),
            fc.constant(new PlayLegalMove(3)),
            fc.constant(new PlayLegalMove(4)),
            fc.constant(new PlayLegalMove(5)),
            fc.constant(new PlayLegalMove(6)),
            fc.constant(new PlayIllegalMove(0)),
            fc.constant(new PlayIllegalMove(1)),
            fc.constant(new PlayIllegalMove(2)),
            fc.constant(new PlayIllegalMove(3)),
            fc.constant(new PlayIllegalMove(4)),
            fc.constant(new PlayIllegalMove(5)),
            fc.constant(new PlayIllegalMove(6)),
        ];

        await fc.assert(
            fc.asyncProperty(fc.commands(commands, { size: 'large' }), async (commands) => {
                await page.goto('http://localhost:3000');
                const model: TestModel = {
                    currentPlayer: 0,
                    page: page,
                    history: {},
                };
                const setup = () => ({ model: model, real: page });
                await fc.asyncModelRun(setup, commands);
            }),
            { verbose: 2 }
        );
    }, 900000);
});

// Error: Property failed after 2 tests
// { seed: -173269550, path: "1:3", endOnFailure: true }
// Counterexample: [PlayToken[4],NewGame,Refresh,PlayToken[5] /*replayPath="CBBBD:V"*/]
// Shrunk 1 time(s)
// Got AssertionError: expected [ { col: 5, from: null, to: +0 } ] to deeply equal [ { col: 5, from: null, to: 1 } ]
//     at PlayTokenCommand.run (/Users/wojci/sandbox/thesis/CF/vitest/example-model/commands/PlayTokenCommand.ts:25:29)
//     at runAsync (file:///Users/wojci/sandbox/thesis/CF/vitest/node_modules/fast-check/lib/esm/check/model/ModelRunner.js:45:13)
//     at internalAsyncModelRun (file:///Users/wojci/sandbox/thesis/CF/vitest/node_modules/fast-check/lib/esm/check/model/ModelRunner.js:47:12)
//     at Proxy.asyncModelRun (file:///Users/wojci/sandbox/thesis/CF/vitest/node_modules/fast-check/lib/esm/check/model/ModelRunner.js:53:5)
//     at /Users/wojci/sandbox/thesis/CF/vitest/example-model/example.spec.ts:76:25
//     at AsyncProperty.run (file:///Users/wojci/sandbox/thesis/CF/vitest/node_modules/fast-check/lib/esm/check/property/AsyncProperty.generic.js:46:28)
//     at asyncRunIt (file:///Users/wojci/sandbox/thesis/CF/vitest/node_modules/fast-check/lib/esm/check/runner/Runner.js:33:21)
//     at /Users/wojci/sandbox/thesis/CF/vitest/example-model/example.spec.ts:37:13
//     at runTest (file:///Users/wojci/sandbox/thesis/CF/vitest/node_modules/@vitest/runner/dist/index.js:781:11)
//     at runSuite (file:///Users/wojci/sandbox/thesis/CF/vitest/node_modules/@vitest/runner/dist/index.js:909:15)
