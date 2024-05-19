import { Calculator } from '../components/Calculator';
import { Navigation } from '../components/Navigation';
import { Page } from './abstract/PageObject';

export class WhyInvestPage extends Page {
    public readonly navigation = new Navigation(this.page.locator('header'));
    public readonly getReportButton = () => this.page.getByRole('link', { name: 'Annual Report 2023 (PDF - 8.' });
    public readonly calculator = new Calculator(
        this.page.getByRole('tabpanel', { name: 'GBp' }).frameLocator('iframe[title="share price"]')
    );
}
