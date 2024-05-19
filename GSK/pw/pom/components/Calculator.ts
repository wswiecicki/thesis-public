import { FrameLocator } from '@playwright/test';
import { ComponentObject } from './abstract/ComponentObject';

export class Calculator {
    constructor(public readonly parent: FrameLocator) {}
    public readonly getSharesInput = () => this.parent.getByRole('textbox', { name: 'Number of Shares', exact: true });
    public readonly getInitialDateInput = () => this.parent.locator('input').nth(1);
    public readonly getFinalDateInput = () => this.parent.locator('input').nth(2);
    public readonly getCalculateButton = () => this.parent.getByRole('button', { name: 'Calculate' });
    public readonly getSummaryData = () => this.parent.locator('.investment-summary--data').nth(1);
}
