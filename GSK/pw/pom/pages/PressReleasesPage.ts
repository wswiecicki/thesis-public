import { PressReleaseSearch } from '../components/PressReleaseSearch';
import { Page } from './abstract/PageObject';

export class PressReleasesPage extends Page {
    public readonly pressReleaseSearch = new PressReleaseSearch(this.page.locator('form.press-releases__search'));
    public navigate = async () => {
        await this.page.goto('https://www.gsk.com/en-gb/media/press-releases/');
        await this.page.getByRole('button', { name: 'Accept all' }).click();
    };

    public navigateWithQuery = async (query: string) => {
        await this.page.goto('https://www.gsk.com/en-gb/media/press-releases/' + `?q=${query}`);
    };
}
