import { Carousel } from '../components/Carousel';
import { Navigation } from '../components/Navigation';
import { Page } from './abstract/PageObject';

export class HomePage extends Page {
    public readonly backToTopButton = this.page.getByRole('link', { name: 'Back to top' });
    public readonly statsCarousel = new Carousel(this.page.locator('div.stats'));
    public readonly btsCarousel = new Carousel(this.page.locator('div.bts-carousel'));
    public readonly cultureCarousel = new Carousel(this.page.locator('div.culture'));
    public readonly navigation = new Navigation(this.page.locator('header'));
    public navigate = async () => {
        await this.page.goto('https://www.gsk.com/en-gb/');
        await this.page.getByRole('button', { name: 'Accept all' }).click();
    };
}
