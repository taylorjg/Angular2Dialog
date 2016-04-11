import {Component, ViewChild} from "angular2/core";
import {NameListItem} from "./nameListItem";
import {NameListItemFormComponent} from "./nameListItemForm.component";
import {NameListService} from "./nameList.service";

@Component({
    selector: "nameList",
    template: 
    `<div class="row">
        <div class="col-md-offset-1 col-md-10">
            <table class="table table-striped table-condensed table-bordered">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email Address</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="#item of _nameListItems">
                        <td>{{item.id}}</td>
                        <td>{{item.firstName}}</td>
                        <td>{{item.lastName}}</td>
                        <td>{{item.email}}</td>
                        <td>
                            <button class="btn btn-primary btn-sm editBtn" (click)="_onEditItem(item)">Edit</button>
                            <button class="btn btn-danger btn-sm deleteBtn" (click)="_onDeleteItem(item)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <hr/>
            <button id="addItemBtn" class="btn btn-primary btn-sm" (click)="_onAddItem()">Add Item</button>
        </div>
    </div>
    <nameListItemForm #form></nameListItemForm>`,
    directives: [NameListItemFormComponent]
})
export class NameListComponent {
    @ViewChild("form") private _form: NameListItemFormComponent;
    private _nameListItems: NameListItem[];
    constructor(private _nameListService: NameListService) {
        this._getItems();
    }
    private _getItems() {
        this._nameListService.get().subscribe(arr => this._nameListItems = arr);
    }
    private _onEditItem(oldItem: NameListItem) {
        let clone = this._cloneItem(oldItem);
        let subscription = this._form.editItem(clone).subscribe(
            newItem => {
                this._nameListService.update(newItem).subscribe(response => {
                    console.log(response);
                    this._getItems();
                });
            },
            null,
            () => subscription.unsubscribe());
    }
    private _onDeleteItem(oldItem: NameListItem) {
        this._nameListService.delete(oldItem).subscribe(response => {
            console.log(response);
            this._getItems();
        });
    }
    private _onAddItem() {
        let subscription = this._form.newItem().subscribe(
            newItem => {
                this._nameListService.create(newItem).subscribe(response => {
                    console.log(response);
                    this._getItems();
                });
            },
            null,
            () => subscription.unsubscribe());
    }
    private _cloneItem(item: NameListItem) {
        return new NameListItem(item.id, item.firstName, item.lastName, item.email);
    }
}
