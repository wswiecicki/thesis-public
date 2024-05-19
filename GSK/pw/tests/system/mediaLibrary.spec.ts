import { test, expect } from '@playwright/test';
import { MediaLibrary } from '../../pom/pages/MediaLibraryPage';

test('Media library card is visible', async ({ page }) => {
    const mediaLibrary = new MediaLibrary(page);
    await mediaLibrary.navigate();
    await expect(mediaLibrary.mediaLibraryList.getFirstMediaLibraryCard()).toBeVisible({ timeout: 500 });
});
