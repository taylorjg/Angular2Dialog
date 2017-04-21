import { Component } from "@angular/core";
import { Observer } from "rxjs/Observer";
import { Observable } from "rxjs/Observable";
import { Response } from "@angular/http";
import { NameListItem } from "./nameListItem";
import { NameListService } from "./nameList.service";
import { NameListItemModalService } from "./nameListItemModal.service";

@Component({
    selector: "nameList",
    /* tslint:disable:max-line-length */
    template: `
        <div class="row">
            <div class="offset-md-1 col-md-10">
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
    /* tslint:enable */
})
export class NameListComponent {
    private nameListItems: NameListItem[];
    private serviceCallsInProgressCount = 0;
    private serviceCallInProgress = false;
    private loadingSpinnerVisibility = "hidden";
    private serviceCallErrorMessage = "";
    constructor(
        private nameListItemModalService: NameListItemModalService,
        private nameListService: NameListService) {
        this.getItems();
    }
    private getItems() {
        const observer = this.makeObserver<NameListItem[]>(
            "Failed to refetch items",
            (arr) => this.nameListItems = arr);
        this.nameListService.readAll().subscribe(observer);
    }
    private onEditItem(item: NameListItem) {
        const modalRef = this.nameListItemModalService.editItem(item);
        modalRef.result
            .then((updatedItem) => {
                const observer = this.makeObserver<Response>(
                    `Failed to update item ${item.id}`,
                    (response) => this.getItems());
                this.nameListService.update(updatedItem).subscribe(observer);
            })
            .catch(() => undefined);
    }
    private onDeleteItem(oldItem: NameListItem) {
        const observer = this.makeObserver<Response>(
            `Failed to delete item ${oldItem.id}`,
            (response) => this.getItems());
        this.nameListService.delete(oldItem).subscribe(observer);
    }
    private onAddItem() {
        const modalRef = this.nameListItemModalService.addItem();
        modalRef.result
            .then((addedItem) => {
                const observer = this.makeObserver<Response>(
                    "Failed to create new item",
                    (response) => this.getItems());
                this.nameListService.create(addedItem).subscribe(observer);
            })
            .catch(() => undefined);
    }
    private makeObserver<T>(message: string, next: (value: T) => void): Observer<T> {
        this.incrementServiceCallsInProgressCount();
        return {
            next,
            error: (response: Response) => {
                this.decrementServiceCallsInProgressCount();
                if (response.status && response.statusText) {
                    this.serviceCallErrorMessage = `${message}: ${response.statusText} (${response.status})`;
                } else {
                    this.serviceCallErrorMessage = message;
                }
            },
            complete: () => {
                this.decrementServiceCallsInProgressCount();
                this.serviceCallErrorMessage = "";
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
        this.loadingSpinnerVisibility = (this.serviceCallInProgress) ? "visible" : "hidden";
    }
}
