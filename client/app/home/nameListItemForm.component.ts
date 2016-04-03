import {Component, ViewChild} from "angular2/core";
import {NameListItem} from "./nameListItem";
import {FORM_DIRECTIVES, AbstractControl, ControlGroup, FormBuilder, Validators, NgForm} from "angular2/common";

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
        <div class="col-md-offset-1 col-md-6">
            <h2>{{_title}}</h2>
            <form [ngFormModel]="_myForm" (ngSubmit)="onSubmit()" novalidate>
                <div class="form-group">
                    <label class="control-label" for="firstName">First name</label>
                    <input type="text" id="firstName" class="form-control" [ngFormControl]="_firstName" [(ngModel)]="_item.firstName" required>
                </div>
                <div class="form-group">
                    <label class="control-label" for="lastName">Last name</label>
                    <input type="text" id="lastName" class="form-control" [ngFormControl]="_lastName" [(ngModel)]="_item.lastName" required>
                </div>
                <div class="form-group">
                    <label class="control-label" for="email">Email</label>
                    <!-- http://stackoverflow.com/questions/34072092/generic-mail-validator-in-angular2 -->
                    <input type="email" id="email" class="form-control" [ngFormControl]="_email" [(ngModel)]="_item.email" required>
                </div>
                <button type="submit" class="btn btn-sm btn-default">Save</button>
                <button type="button" class="btn btn-sm" (click)="onCancel()">Cancel</button>
            </form>
            <h3>_myForm.value</h3>
            <pre>{{ _myForm.value | json }}</pre>        
            <h3>_myForm.errors</h3>
            <pre>{{ _myForm.errors | json }}</pre>        
            <h3>_myForm.valid</h3>
            <pre>{{ _myForm.valid | json }}</pre>        
        </div>
    </div>`,
    directives: [FORM_DIRECTIVES],
})
export class NameListItemFormComponent {
    private _myForm: ControlGroup;
    private _firstName: AbstractControl;
    private _lastName: AbstractControl;
    private _email: AbstractControl;
    private _active: boolean = false;
    private _title: string;
    private _item: NameListItem = new NameListItem();
    constructor(fb: FormBuilder) {
        this._myForm = fb.group({
            "firstName": ["", Validators.compose([Validators.required])],
            "lastName": ["", Validators.compose([Validators.required])],
            "email": ["", Validators.compose([Validators.required])]
        });
        this._firstName = this._myForm.controls["firstName"];
        this._lastName = this._myForm.controls["lastName"];
        this._email = this._myForm.controls["email"];
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
    onSubmit() {
        console.log(`onSubmit - this._myForm.valid: ${this._myForm.valid}`);
        if (this._myForm.valid) {
            this._active = false;
        }
    }
    onCancel() {
        this._active = false;
    }
}
