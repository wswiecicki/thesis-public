import { test, expect } from '@playwright/test';
import { ProductPage } from '../../pom/pages/ProductPage';

test.use({
    viewport: { width: 375, height: 900 },
});

test.fail('Products table is visible in mobile viewport', async ({ page }) => {
    const products = new ProductPage(page);
    await products.navigate();
    await expect(products.table.getCellByText('Vaccines').first()).toBeInViewport({ timeout: 500 });
});
