import {Component, ViewChild} from "angular2/core";
import {Observer} from "rxjs/Observer";
import {NameListItem} from "./nameListItem";
import {NameListItemFormComponent} from "./nameListItemForm.component";
import {NameListService} from "./nameList.service";

@Component({
    selector: "nameList",
    template: 
    `<div class="row">
        <div class="col-md-offset-1 col-md-10">
            <div *ngIf="_serviceCallInProgress" class="progress">
                <div class="progress-bar progress-bar-striped active" role="progressbar" style="width: 100%">
                </div>
            </div>
            <div *ngIf="_serviceCallErrorMessage" class="alert alert-danger" role="alert">
                {{ _serviceCallErrorMessage }}
            </div>
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
            <hr />
            <button id="addItemBtn" class="btn btn-primary btn-sm" (click)="_onAddItem()">Add Item</button>
        </div>
    </div>
    <nameListItemForm #form></nameListItemForm>`,
    directives: [NameListItemFormComponent]
})
export class NameListComponent {
    @ViewChild("form") private _form: NameListItemFormComponent;
    private _nameListItems: NameListItem[];
    private _serviceCallInProgress = false;
    private _serviceCallErrorMessage = "";
    constructor(private _nameListService: NameListService) {
        this._getItems();
    }
    private _getItems() {
        let observer = this._makeObserver<NameListItem[]>("get", arr => this._nameListItems = arr);
        this._nameListService.get().subscribe(observer);
    }
    private _onEditItem(oldItem: NameListItem) {
        let clone = this._cloneItem(oldItem);
        let subscription = this._form.editItem(clone).subscribe(
            newItem => {
                let observer = this._makeObserver<any>("update", response => {
                    console.log(response);
                    this._getItems();
                });
                this._nameListService.update(newItem).subscribe(observer);
            },
            null,
            () => subscription.unsubscribe());
    }
    private _onDeleteItem(oldItem: NameListItem) {
        let observer = this._makeObserver<any>("delete", response => {
            console.log(response);
            this._getItems();
        });
        this._nameListService.delete(oldItem).subscribe(observer);
    }
    private _onAddItem() {
        let subscription = this._form.newItem().subscribe(
            newItem => {
                let observer = this._makeObserver<any>("create", response => {
                    console.log(response);
                    this._getItems();
                });
                this._nameListService.create(newItem).subscribe(observer);
            },
            null,
            () => subscription.unsubscribe());
    }
    private _cloneItem(item: NameListItem) {
        return new NameListItem(item.id, item.firstName, item.lastName, item.email);
    }
    private _makeObserver<T>(serviceMethod: string, next: (value: T) => void): Observer<T> {
        this._serviceCallInProgress = true;
        this._serviceCallErrorMessage = "";
        return {
            next: next,
            error: response => {
                this._serviceCallInProgress = false;
                this._serviceCallErrorMessage = `Call to ${serviceMethod} failed (${response.status} ${response.text()}).`;
            },
            complete: () => {
                this._serviceCallInProgress = false;
                this._serviceCallErrorMessage = "";
            }
        };
    }
}
