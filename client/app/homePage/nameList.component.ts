import { Component } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Response } from "@angular/http";
import { NameListItem } from './nameListItem';
import { VersionService } from './version.service';
import { NameListService } from './nameList.service';
import { NameListItemModalService } from './nameListItemModal.service';

@Component({
    selector: 'nameList',
    template: `
        <div class="row">
            <div class="col-md-offset-1 col-md-10">
                <span class="pull-right"><i><small>version: {{ version | async }}</small></i></span>
                <hr />
                <div *ngIf="serviceCallErrorMessage" class="alert alert-danger" role="alert">
                    {{ serviceCallErrorMessage }}
                </div>
                <table class="table table-striped table-condensed table-bordered">
                    <thead>
                        <tr>
                            <th>Id <img [ngStyle]="{ 'visibility': loadingSpinnerVisibility }" src="smallLoadingSpinner.gif" alt="table reloading spinner"></th>
                            <th>First Name <img [ngStyle]="{ 'visibility': loadingSpinnerVisibility }" src="smallLoadingSpinner.gif" alt="table reloading spinner"></th>
                            <th>Last Name <img [ngStyle]="{ 'visibility': loadingSpinnerVisibility }" src="smallLoadingSpinner.gif" alt="table reloading spinner"></th>
                            <th>Email Address <img [ngStyle]="{ 'visibility': loadingSpinnerVisibility }" src="smallLoadingSpinner.gif" alt="table reloading spinner"></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let item of nameListItems">
                            <td>{{ item.id }}</td>
                            <td>{{ item.firstName }}</td>
                            <td>{{ item.lastName }}</td>
                            <td>{{ item.email }}</td>
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
        <template ngbModalContainer></template>`
})
export class NameListComponent {
    private version: Observable<string>;
    private nameListItems: NameListItem[];
    private serviceCallsInProgressCount = 0;
    private serviceCallInProgress = false;
    private loadingSpinnerVisibility = 'hidden';
    private serviceCallErrorMessage = '';
    constructor(
        private nameListItemModalService: NameListItemModalService,
        private versionService: VersionService,
        private nameListService: NameListService) {
        this.getVersion();
        this.getItems();
    }
    private getVersion() {
        this.version = this.versionService.get();
    }
    private getItems() {
        const observer = this.makeObserver<NameListItem[]>('get all items', arr => this.nameListItems = arr);
        this.nameListService.readAll().subscribe(observer);
    }
    private onEditItem(item: NameListItem) {
        const modalRef = this.nameListItemModalService.editItem(item);
        modalRef.result
            .then(updatedItem => {
                const observer = this.makeObserver<Response>('update an item', response => this.getItems());
                this.nameListService.update(updatedItem).subscribe(observer);
            })
            .catch(_ => { });
    }
    private onDeleteItem(oldItem: NameListItem) {
        const observer = this.makeObserver<Response>('delete an item', response => this.getItems());
        this.nameListService.delete(oldItem).subscribe(observer);
    }
    private onAddItem() {
        const modalRef = this.nameListItemModalService.addItem();
        modalRef.result
            .then(addedItem => {
                const observer = this.makeObserver<Response>('create an item', response => this.getItems());
                this.nameListService.create(addedItem).subscribe(observer);
            })
            .catch(_ => { });
    }
    private makeObserver<T>(actionDescription: string, next: (value: T) => void): Observer<T> {
        this.incrementServiceCallsInProgressCount();
        this.serviceCallErrorMessage = '';
        return {
            next: next,
            error: error => {
                this.decrementServiceCallsInProgressCount();
                this.serviceCallErrorMessage = `Attempt to ${actionDescription} failed with ${error}.`;
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
        this.loadingSpinnerVisibility = (this.serviceCallInProgress) ? 'visible' : 'hidden';
    }
}
