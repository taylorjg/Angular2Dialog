export class NameListItem {
    constructor(
        public id: number = -1,
        public firstName: string = '',
        public lastName: string = '',
        public email: string = '') {
    }
    clone() {
        return new NameListItem(this.id, this.firstName, this.lastName, this.email);
    }
}
