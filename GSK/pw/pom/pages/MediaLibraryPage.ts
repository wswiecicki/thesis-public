import { MediaLibraryList } from '../components/MediaLibraryList';
import { Page } from './abstract/PageObject';

export class MediaLibrary extends Page {
    public readonly mediaLibraryList = new MediaLibraryList(this.page.locator('.media-library'));
    public navigate = async () => {
        await this.page.goto('https://www.gsk.com/en-gb/media/media-library/');
        await this.page.getByRole('button', { name: 'Accept all' }).click();
    };
}
