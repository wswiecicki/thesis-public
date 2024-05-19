import { Table } from '../components/Table';
import { TableFilter } from '../components/TableFilter';
import { Page } from './abstract/PageObject';

export class ProductPage extends Page {
    public readonly tableFilter = new TableFilter(this.page.locator('fieldset'));
    public readonly table = new Table(this.page.locator('.tabbed-content'));
    public navigate = async () => {
        await this.page.goto('https://www.gsk.com/en-gb/products/products-a-z/');
        await this.page.getByRole('button', { name: 'Accept all' }).click();
    };
}
