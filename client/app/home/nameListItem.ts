export class NameListItem {
    constructor(
        public firstName: string,
        public lastName: string,
        public email: string,
        public id?: number,
        public readUri?: string,
        public updateUri?: string,
        public deleteUri?: string) {
    }
}
