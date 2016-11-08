import {Component, ViewChild} from '@angular/core';
import {Observer} from 'rxjs/Observer';
import {NameListItem} from './nameListItem';
import {NameListService} from './nameList.service';
import {NameListItemModalComponent} from './nameListItemModal.component';

@Component({
    selector: 'nameList',
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
                    <tr *ngFor="let item of _nameListItems">
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
    <nameListItemModal #mymodal></nameListItemModal>`
})
export class NameListComponent {
    @ViewChild('mymodal') private _mymodal: NameListItemModalComponent;
    private _nameListItems: NameListItem[];
    private _serviceCallsInProgressCount = 0;
    private _serviceCallInProgress = false;
    private _serviceCallErrorMessage = '';
    constructor(private _nameListService: NameListService) {
        this._getItems();
    }
    private _getItems() {
        let observer = this._makeObserver<NameListItem[]>('get', arr => this._nameListItems = arr);
        this._nameListService.get().subscribe(observer);
    }
    private _onEditItem(oldItem: NameListItem) {
        let clone = this._cloneItem(oldItem);
        let subscription = this._mymodal.editItem(clone).subscribe(
            newItem => {
                let observer = this._makeObserver<any>('update', response => {
                    console.log(response);
                    this._getItems();
                });
                this._nameListService.update(newItem).subscribe(observer);
            },
            null,
            () => subscription.unsubscribe());
    }
    private _onDeleteItem(oldItem: NameListItem) {
        let observer = this._makeObserver<any>('delete', response => {
            console.log(response);
            this._getItems();
        });
        this._nameListService.delete(oldItem).subscribe(observer);
    }
    private _onAddItem() {
        let subscription = this._mymodal.newItem().subscribe(
            newItem => {
                let observer = this._makeObserver<any>('create', response => {
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
        this._incrementServiceCallsInProgressCount();
        this._serviceCallErrorMessage = '';
        return {
            next: next,
            error: response => {
                this._decrementServiceCallsInProgressCount();
                this._serviceCallErrorMessage = `Call to ${serviceMethod} failed (${response.status} ${response.text()}).`;
            },
            complete: () => {
                this._decrementServiceCallsInProgressCount();
                this._serviceCallErrorMessage = '';
            }
        };
    }
    private _incrementServiceCallsInProgressCount() {
        this._changeServiceCallsInProgressCount(+1);
    }
    private _decrementServiceCallsInProgressCount() {
        this._changeServiceCallsInProgressCount(-1);
    }
    private _changeServiceCallsInProgressCount(delta: number) {
        this._serviceCallsInProgressCount += delta;
        this._serviceCallInProgress = (this._serviceCallsInProgressCount > 0);
    }
}
