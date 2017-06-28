export class UserMenuItem {
    name: string = '';
    permissionName: string = '';
    roleName: string = '';
    icon: string = '';
    route: string = '';
    parameter:string = '';
    items: UserMenuItem[];

    constructor(name: string, permissionName: string, roleName:string, icon: string, route: string, parameter:string = '', items?: UserMenuItem[]) {
        this.name = name;
        this.permissionName = permissionName;
        this.roleName = roleName;
        this.icon = icon;
        this.route = route;
        this.parameter = parameter;

        if (items === undefined) {
            this.items = [];    
        } else {
            this.items = items;
        }        
    }
}