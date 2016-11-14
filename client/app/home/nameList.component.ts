import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observer } from 'rxjs/Observer';
import { Response } from "@angular/http";
import { NameListItem } from './nameListItem';
import { NameListService } from './nameList.service';
import { NameListItemModalContentComponent } from './nameListItemModalContent.component';

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
    <template ngbModalContainer></template>`
})
export class NameListComponent {
    private nameListItems: NameListItem[];
    private serviceCallsInProgressCount = 0;
    private serviceCallInProgress = false;
    private serviceCallErrorMessage = '';
    constructor(private modalService: NgbModal, private nameListService: NameListService) {
        this.getItems();
    }
    private getItems() {
        let observer = this.makeObserver<NameListItem[]>('get', arr => this.nameListItems = arr);
        this.nameListService.get().subscribe(observer);
    }
    private onEditItem(oldItem: NameListItem) {
        let clone = this.cloneItem(oldItem);
        const modalRef = this.modalService.open(NameListItemModalContentComponent);
        modalRef.componentInstance.item = clone;
        modalRef.componentInstance.editMode = true;
        modalRef.result
            .then(updatedItem => {
                let observer = this.makeObserver<Response>('update', response => {
                    console.log(response);
                    this.getItems();
                });
                this.nameListService.update(updatedItem).subscribe(observer);
            })
            .catch(_ => {
            });
    }
    private onDeleteItem(oldItem: NameListItem) {
        let observer = this.makeObserver<Response>('delete', response => {
            console.log(response);
            this.getItems();
        });
        this.nameListService.delete(oldItem).subscribe(observer);
    }
    private onAddItem() {
        const modalRef = this.modalService.open(NameListItemModalContentComponent);
        modalRef.componentInstance.item = new NameListItem();
        modalRef.componentInstance.editMode = false;
        modalRef.result
            .then(newItem => {
                let observer = this.makeObserver<Response>('create', response => {
                    console.log(response);
                    this.getItems();
                });
                this.nameListService.create(newItem).subscribe(observer);
            })
            .catch(_ => {
            });
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
