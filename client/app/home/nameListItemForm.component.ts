import {Component, ViewChild} from "angular2/core";
import {NameListItem} from "./nameListItem";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, AbstractControl, ControlGroup, FormBuilder, Validators} from "angular2/common";

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
                <div class="form-group has-feedback" [class.has-success]="_hasSuccessFlags['firstName']" [class.has-error]="_hasErrorFlags['firstName']">
                    <label class="control-label" for="firstName">First name</label>
                    <input type="text" id="firstName" class="form-control" [ngFormControl]="_firstName" [(ngModel)]="_item.firstName" required>
                    <span *ngIf="_firstName.valid" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                    <span *ngIf="!_firstName.valid" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                </div>
                <div class="form-group has-feedback" [class.has-success]="_hasSuccessFlags['lastName']" [class.has-error]="_hasErrorFlags['lastName']">
                    <label class="control-label" for="lastName">Last name</label>
                    <input type="text" id="lastName" class="form-control" [ngFormControl]="_lastName" [(ngModel)]="_item.lastName" required>
                    <span *ngIf="_lastName.valid" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                    <span *ngIf="!_lastName.valid" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                </div>
                <div class="form-group has-feedback" [class.has-success]="_hasSuccessFlags['email']" [class.has-error]="_hasErrorFlags['email']">
                    <label class="control-label" for="email">Email</label>
                    <!-- http://stackoverflow.com/questions/34072092/generic-mail-validator-in-angular2 -->
                    <input type="email" id="email" class="form-control" [ngFormControl]="_email" [(ngModel)]="_item.email" required>
                    <span *ngIf="_email.valid" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                    <span *ngIf="!_email.valid" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
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
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES],
})
export class NameListItemFormComponent {
    private _myForm: ControlGroup;
    private _firstName: AbstractControl;
    private _lastName: AbstractControl;
    private _email: AbstractControl;
    private _hasSuccessFlags = new Map<string, boolean>();
    private _hasErrorFlags = new Map<string, boolean>();
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
        this._myForm.statusChanges.subscribe(this._updateFlags.bind(this));
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
    private _updateFlags() {
        for (var name in this._myForm.controls) {
            var ac = this._myForm.controls[name];
            // What if ac is a ControlGroup ?
            this._hasSuccessFlags[name] = ac.valid 
            this._hasErrorFlags[name] = !ac.valid; 
        }
    }
}
