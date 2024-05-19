import { test, expect } from '@playwright/test';
import { HomePage } from '../pom/pages/HomePage';
import { WhyInvestPage } from '../pom/pages/WhyInvestPage';
import * as fs from 'node:fs';

test('Fulfills the investor user story', async ({ page }) => {
    const home = new HomePage(page);
    const whyInvest = new WhyInvestPage(page);

    await home.navigate();
    await home.navigation.getSubmenuButton().click();
    await home.navigation.getSubmenuLink('Investors').click();
    await home.navigation.getSubmenuLink('Why invest in GSK?').click();

    const reportPromise = page.waitForEvent('download');
    await whyInvest.getReportButton().click({ modifiers: ['Alt'] });
    const download = await reportPromise;
    expect((await fs.promises.stat((await download.path()) as string)).size).toBeGreaterThan(8000000);

    await home.navigation.getSubmenuButton().click();
    await whyInvest.navigation.getSubmenuLink('Investors').click();
    await whyInvest.navigation.getSubmenuLink('Dividend and share price').click();
    await whyInvest.navigation.getSubmenuLink('Share price calculators').click();

    await whyInvest.calculator.getSharesInput().fill('300');
    await whyInvest.calculator.getInitialDateInput().fill('2022-04-28');
    await whyInvest.calculator.getFinalDateInput().fill('2024-04-27');
    await whyInvest.calculator.getCalculateButton().click();
    await expect(whyInvest.calculator.getSummaryData()).toContainText('-15,740');
});
