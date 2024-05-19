import { ComponentObject } from './abstract/ComponentObject';

export class Navigation extends ComponentObject {
    public readonly getSubmenuButton = () => this.parent.locator('.secondary-nav__mobile-menu-link');
    public readonly getSubmenuLink = (name: string) => this.parent.getByRole('link', { name: name }).first();
}
