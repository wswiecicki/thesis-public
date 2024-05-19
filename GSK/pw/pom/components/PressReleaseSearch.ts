import { ComponentObject } from './abstract/ComponentObject';

export class PressReleaseSearch extends ComponentObject {
    public readonly getSearchBar = () => this.parent.getByRole('searchbox', { name: 'Enter a search term...' });
    public readonly getSearchButton = () => this.parent.getByRole('button', { name: 'Search' });
}
