import { ComponentObject } from './abstract/ComponentObject';

export class MediaLibraryList extends ComponentObject {
    public getFirstMediaLibraryCard = () => this.parent.locator('.media-library__grid__item').first();
}
