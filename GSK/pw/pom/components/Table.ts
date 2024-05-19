import { ComponentObject } from './abstract/ComponentObject';

export class Table extends ComponentObject {
    public readonly getTableFilterByLetters = (letters: string) => {
        return this.parent.getByRole('tab', { name: letters });
    };

    public readonly getCellByText = (cellContent: string) => {
        return this.parent.getByRole('cell', { name: cellContent });
    };
}
