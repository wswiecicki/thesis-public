import { test, expect } from '@playwright/test';
import { HomePage } from '../pom/pages/HomePage';
import { ProductPage } from '../pom/pages/ProductPage';

test('Fulfills the customer user story', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductPage(page);

    await home.navigate();
    await home.statsCarousel.getNextArrow().click();
    await expect(home.statsCarousel.getCardByHeader('people died from cancer in')).toBeVisible();

    await home.btsCarousel.getNextArrow().click();
    await home.btsCarousel.getNextArrow().click();
    await expect(home.btsCarousel.getCardByHeader('Prevention is the best medicine')).toBeVisible();

    await home.cultureCarousel.getNextArrow().click();
    await home.cultureCarousel.getNextArrow().click();

    await home.backToTopButton.click();

    await home.navigation.getSubmenuButton().click();
    await home.navigation.getSubmenuLink('Products').click();
    await home.navigation.getSubmenuLink('Products A-Z').click();

    await products.tableFilter.getVaccineFilter().click();
    await products.table.getTableFilterByLetters('M - P').click();
    await expect(products.table.getCellByText('Menveo')).toBeVisible();
});
