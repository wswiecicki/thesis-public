import { ComponentObject } from './abstract/ComponentObject';

export class TableFilter extends ComponentObject {
    public readonly getVaccineFilter = () => this.parent.locator('#tablist-product-area-1');
}
