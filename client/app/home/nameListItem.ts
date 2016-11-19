export class NameListItem {
    constructor(
        readonly firstName: string,
        readonly lastName: string,
        readonly email: string,
        readonly id?: number,
        readonly readUri?: string,
        readonly updateUri?: string,
        readonly deleteUri?: string) {
    }
}
