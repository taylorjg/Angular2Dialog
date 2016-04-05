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
        _nameListService.get().subscribe(arr => this._nameListItems = arr);
    }
    private _onEditItem(oldItem: NameListItem) {
        let clone = oldItem.clone();
        let subscription = this._form.editItem(clone).subscribe(
            newItem => {
                let index = this._nameListItems.indexOf(oldItem);
                this._nameListItems.splice(index, 1, newItem);
            },
            null,
            () => subscription.unsubscribe());
    }
    private _onDeleteItem(oldItem: NameListItem) {
        let index = this._nameListItems.indexOf(oldItem); 
        this._nameListItems.splice(index, 1);
    }
    private _onAddItem() {
        let subscription = this._form.newItem().subscribe(
            newItem => {
                this._nameListItems.push(newItem);
            },
            null,
            () => subscription.unsubscribe());
    }
}
