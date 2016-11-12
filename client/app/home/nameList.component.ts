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
            <div *ngIf="serviceCallInProgress" class="progress">
                <div class="progress-bar progress-bar-striped active" role="progressbar" style="width: 100%">
                </div>
            </div>
            <div *ngIf="serviceCallErrorMessage" class="alert alert-danger" role="alert">
                {{ serviceCallErrorMessage }}
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
                    <tr *ngFor="let item of nameListItems">
                        <td>{{item.id}}</td>
                        <td>{{item.firstName}}</td>
                        <td>{{item.lastName}}</td>
                        <td>{{item.email}}</td>
                        <td>
                            <button class="btn btn-primary btn-sm editBtn" (click)="onEditItem(item)">Edit</button>
                            <button class="btn btn-danger btn-sm deleteBtn" (click)="onDeleteItem(item)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <hr />
            <button id="addItemBtn" class="btn btn-primary btn-sm" (click)="onAddItem()">Add Item</button>
        </div>
    </div>
    <nameListItemModal #mymodal></nameListItemModal>`
})
export class NameListComponent {
    @ViewChild('mymodal') private mymodal: NameListItemModalComponent;
    private nameListItems: NameListItem[];
    private serviceCallsInProgressCount = 0;
    private serviceCallInProgress = false;
    private serviceCallErrorMessage = '';
    constructor(private nameListService: NameListService) {
        this.getItems();
    }
    private getItems() {
        let observer = this.makeObserver<NameListItem[]>('get', arr => this.nameListItems = arr);
        this.nameListService.get().subscribe(observer);
    }
    private onEditItem(oldItem: NameListItem) {
        let clone = this.cloneItem(oldItem);
        let subscription = this.mymodal.editItem(clone).subscribe(
            newItem => {
                let observer = this.makeObserver<any>('update', response => {
                    console.log(response);
                    this.getItems();
                });
                this.nameListService.update(newItem).subscribe(observer);
            },
            null,
            () => subscription.unsubscribe());
    }
    private onDeleteItem(oldItem: NameListItem) {
        let observer = this.makeObserver<any>('delete', response => {
            console.log(response);
            this.getItems();
        });
        this.nameListService.delete(oldItem).subscribe(observer);
    }
    private onAddItem() {
        let subscription = this.mymodal.newItem().subscribe(
            newItem => {
                let observer = this.makeObserver<any>('create', response => {
                    console.log(response);
                    this.getItems();
                });
                this.nameListService.create(newItem).subscribe(observer);
            },
            null,
            () => subscription.unsubscribe());
    }
    private cloneItem(item: NameListItem) {
        return new NameListItem(item.id, item.firstName, item.lastName, item.email);
    }
    private makeObserver<T>(serviceMethod: string, next: (value: T) => void): Observer<T> {
        this.incrementServiceCallsInProgressCount();
        this.serviceCallErrorMessage = '';
        return {
            next: next,
            error: response => {
                this.decrementServiceCallsInProgressCount();
                this.serviceCallErrorMessage = `Call to ${serviceMethod} failed (${response.status} ${response.text()}).`;
            },
            complete: () => {
                this.decrementServiceCallsInProgressCount();
                this.serviceCallErrorMessage = '';
            }
        };
    }
    private incrementServiceCallsInProgressCount() {
        this.changeServiceCallsInProgressCount(+1);
    }
    private decrementServiceCallsInProgressCount() {
        this.changeServiceCallsInProgressCount(-1);
    }
    private changeServiceCallsInProgressCount(delta: number) {
        this.serviceCallsInProgressCount += delta;
        this.serviceCallInProgress = (this.serviceCallsInProgressCount > 0);
    }
}
