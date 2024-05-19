import { test, expect } from '@playwright/test';
import { HomePage } from '../../pom/pages/HomePage';

test.fail('Carousel arrow does not move away', async ({ page }) => {
    const home = new HomePage(page);
    await home.navigate();
    await home.statsCarousel.getNextArrow().hover({ position: { x: 0, y: 10 } });

    await expect(home.statsCarousel.getNextArrow()).not.toHaveCSS('transform', /matrix/, { timeout: 500 });
});
