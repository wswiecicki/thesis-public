import { test, expect } from '@playwright/test';
import { PressReleasesPage } from '../../pom/pages/PressReleasesPage';

test.fail('Press release search handles special characters gracefully', async ({ page }) => {
    const pressReleases = new PressReleasesPage(page);
    await pressReleases.navigateWithQuery('*');
    expect(await page.title()).not.toContain('We are currently updating the site');
});
