import {Component, ViewChild} from "angular2/core";
import {NameListItem} from "./nameListItem";
import {FORM_DIRECTIVES, NgForm} from "angular2/common";

/*
 * This form should really be a modal dialog instead.
 * 
 * I am waiting for the following package to add support for Bootstrap modals:
 * 
 *  https://github.com/valor-software/ng2-bootstrap
 */

@Component({
    selector: "nameListItemForm",
    template:
    `<div *ngIf="_active" class="row">
        <div class="col-md-offset-1 col-md-5">
            <h2>{{_title}}</h2>
            <form #f="ngForm" (ngSubmit)="onSubmit(f.value, f.valid)" novalidate>
                <div class="form-group">
                    <label class="control-label" for="firstName">First name</label>
                    <input type="text" id="firstName" class="form-control" ngControl="firstName" [(ngModel)]="_item.firstName" required />
                </div>
                <div class="form-group">
                    <label class="control-label" for="lastName">Last name</label>
                    <input type="text" id="lastName" class="form-control" ngControl="lastName" [(ngModel)]="_item.lastName" required />
                </div>
                <div class="form-group">
                    <label class="control-label" for="email">Email</label>
                    <!-- http://stackoverflow.com/questions/34072092/generic-mail-validator-in-angular2 -->
                    <input type="email" id="email" class="form-control" ngControl="email" [(ngModel)]="_item.email" required />
                </div>
                <button type="submit" class="btn btn-sm btn-default">Save</button>
                <button type="button" class="btn btn-sm" (click)="onCancel()">Cancel</button>
            </form>
            <h3>_formValue</h3>
            <pre>{{ _formValue | json }}</pre>        
        </div>
    </div>`,
    directives: [FORM_DIRECTIVES],
})
export class NameListItemFormComponent {
    private _active: boolean = false;
    private _title: string;
    private _item: NameListItem = new NameListItem();
    private _formValue: Object = {};
    constructor() {
    }
    editItem(item: NameListItem) {
        this._title = `Edit Item ${item.id}`;
        this._item = item;
        this._active = true;
    }
    newItem() {
        this._title = `New Item`;
        this._item = new NameListItem();
        this._active = true;
    }
    onSubmit(formValue: Object, valid: boolean) {
        console.log(`onSubmit - valid: ${valid}`);
        this._formValue = formValue;
        if (valid) {
            this._active = false;
        }
    }
    onCancel() {
        this._active = false;
    }
}
