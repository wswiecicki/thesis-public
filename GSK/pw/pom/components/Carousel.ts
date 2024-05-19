import { ComponentObject } from './abstract/ComponentObject';

export class Carousel extends ComponentObject {
    public getCardByHeader = (cardHeader: string) => this.parent.filter({ hasText: cardHeader });
    public getNextArrow = () => this.parent.getByLabel('Next slide').first();
}
