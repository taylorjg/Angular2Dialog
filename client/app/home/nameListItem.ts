export class NameListItem {
    constructor(
        public id: number = -1,
        public firstName: string = '',
        public lastName: string = '',
        public email: string = '',
        public readUri?: string,
        public updateUri?: string,
        public deleteUri?: string) {
    }
}
