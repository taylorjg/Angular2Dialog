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
    `<div class="row">
        <div class="col-md-offset-1 col-md-5">
            <h2>{{_title}}</h2>
            <form #f="ngForm" (ngSubmit)="onSubmit(f.value, f.valid)" novalidate>
                <div class="form-group">
                    <label for="firstName">First name</label>
                    <input type="text" class="form-control" ngControl="firstName" [(ngModel)]="_item.firstName" required />
                </div>
                <div class="form-group">
                    <label for="lastName">Last name</label>
                    <input type="text" class="form-control" ngControl="lastName" [(ngModel)]="_item.lastName" required />
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" ngControl="email" [(ngModel)]="_item.email" required />
                </div>
                <br />
                <button type="submit">Submit</button>
            </form>
            <h3>formValue</h3>
            <pre>{{ formValue | json }}</pre>        
        </div>
    </div>`,
    directives: [FORM_DIRECTIVES],
})
export class NameListItemFormComponent {
    private _title: string;
    private _item: NameListItem;
    formValue: Object = {};
    constructor() {
        this.newItem();
    }
    editItem(item: NameListItem) {
        this._title = `Edit Item ${item.id}`;
        this._item = item;
    }
    newItem() {
        this._title = `New Item`;
        this._item = new NameListItem(-1, "", "", "");
    }
    onSubmit(formValue: Object, valid: boolean) {
        console.log(`onSubmit - valid: ${valid}`);
        this.formValue = formValue;
    }
}
