import { test, expect } from '@playwright/test';
import { HomePage } from '../../pom/pages/HomePage';

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

test.fail('No errors are thrown in the homepage', async ({ page }) => {
    page.on('console', (msg) => {
        expect(msg.type()).not.toBe('error');
    });

    page.on('pageerror', (err) => {
        expect(err).not.toBeInstanceOf(Error);
    });

    const home = new HomePage(page);
    await home.navigate();
    await sleep(500);
});
