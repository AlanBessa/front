import {UserMenuItem} from './user-menu-item';

export class UserMenu {
    name: string = '';
    displayName: string = '';
    items: UserMenuItem[];

    constructor(name: string, displayName: string, items: UserMenuItem[]) {
        this.name = name;
        this.displayName = displayName;
        this.items = items;
    }
}