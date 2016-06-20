import {Component, ViewChild, ApplicationRef} from "@angular/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, AbstractControl, Validators} from "@angular/common";
import {ModalDirective, MODAL_DIRECTVES, BS_VIEW_PROVIDERS} from "ng2-bootstrap/ng2-bootstrap";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {NameListItem} from "./nameListItem";
import {CustomValidators} from "./customValidators";

@Component({
    selector: 'nameListItemModal',
    template: `
    <div bsModal #modal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <form [ngFormModel]="_myForm" (ngSubmit)="_onSubmit()" novalidate>

                    <div class="modal-header">
                        <button type="button" class="close" (click)="modal.hide()" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h2 class="modal-title">{{_title}}</h2>
                    </div>

                    <div class="modal-body">
                            <div class="form-group" [ngClass]="_setFeedbackClasses(_firstName)">
                                <label class="control-label" for="firstName">First name</label>
                                <input type="text" id="firstName" class="form-control" [ngFormControl]="_firstName" [(ngModel)]="_item.firstName">
                                <span *ngIf="_firstName.valid && _firstName.touched" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                                <span *ngIf="!_firstName.valid && _firstName.touched" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                                <div *ngIf="_firstName.hasError('required') && _firstName.touched" class="help-block">Please enter your first name</div> 
                            </div>
                            <div class="form-group" [ngClass]="_setFeedbackClasses(_lastName)">
                                <label class="control-label" for="lastName">Last name</label>
                                <input type="text" id="lastName" class="form-control" [ngFormControl]="_lastName" [(ngModel)]="_item.lastName">
                                <span *ngIf="_lastName.valid && _lastName.touched" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                                <span *ngIf="!_lastName.valid && _lastName.touched" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                                <div *ngIf="_lastName.hasError('required') && _lastName.touched" class="help-block">Please enter your last name</div> 
                            </div>
                            <div class="form-group" [ngClass]="_setFeedbackClasses(_email)">
                                <label class="control-label" for="email">Email</label>
                                <input type="email" id="email" class="form-control" [ngFormControl]="_email" [(ngModel)]="_item.email">
                                <span *ngIf="_email.valid && _email.touched" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                                <span *ngIf="!_email.valid && _email.touched" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                                <div *ngIf="_email.hasError('required') && _email.touched" class="help-block">Please enter your email address</div> 
                                <div *ngIf="_email.hasError('email') && _email.touched" class="help-block">Please enter a valid email address</div> 
                            </div>
                    </div>

                    <div class="modal-footer">
                        <button type="submit" class="btn btn-sm btn-primary">Save</button>
                        <button type="button" class="btn btn-sm" (click)="_onCancel()">Cancel</button>
                    </div>
                
                </form>
            </div>
        </div>
    </div>`,
    directives: [FORM_DIRECTIVES, MODAL_DIRECTVES, CORE_DIRECTIVES],
    viewProviders: [BS_VIEW_PROVIDERS]
})
export class NameListItemModalComponent {
    @ViewChild("modal") private _modal: ModalDirective;
    private _myForm: ControlGroup;
    private _firstName: AbstractControl;
    private _lastName: AbstractControl;
    private _email: AbstractControl;
    private _title: string = "";
    private _item: NameListItem = null;
    private _currentItem$: Subject<NameListItem>= null;
    constructor(private _fb: FormBuilder, private _applicationRef: ApplicationRef) {
        this._item = new NameListItem();
        this._rebuildForm(false);
    }
    public editItem(item: NameListItem): Observable<NameListItem> {
        this._item = new NameListItem();
        this._forceTick();
        this._item = item;
        this._rebuildForm(true);
        this._title = `Edit Item ${item.id}`;
        this._modal.show();
        return this._createCurrentItem$();
    }
    public newItem(): Observable<NameListItem> {
        this._item = new NameListItem();
        this._rebuildForm(false);
        this._title = `New Item`;
        this._modal.show();
        return this._createCurrentItem$();
    }
    private _onSubmit() {
        if (this._myForm.valid) {
            this._currentItem$.next(this._item);
            this._currentItem$.complete();
            this._currentItem$ = null;
            this._modal.hide();
        }
    }
    private _onCancel() {
        this._currentItem$.complete();
        this._currentItem$ = null;
        this._modal.hide();
    }
    private _setFeedbackClasses(c: AbstractControl) {
        return {
            "has-feedback": c.touched,
            "has-success": c.touched && c.valid,
            "has-error": c.touched && !c.valid
        };
    }
    private _createCurrentItem$(): Subject<NameListItem> {
        if (this._currentItem$) {
            this._currentItem$.complete();
        }
        this._currentItem$ = new Subject<NameListItem>();
        return this._currentItem$;
    }
    private _rebuildForm(editMode: boolean): void{
        this._myForm = this._fb.group({
            "firstName": ["", Validators.compose([Validators.required])],
            "lastName": ["", Validators.compose([Validators.required])],
            "email": ["", Validators.compose([Validators.required, CustomValidators.email])]
        });
        this._firstName = this._myForm.controls["firstName"];
        this._lastName = this._myForm.controls["lastName"];
        this._email = this._myForm.controls["email"];
        if (editMode) {
            this._firstName.markAsTouched();
            this._lastName.markAsTouched();
            this._email.markAsTouched();
        }
    }
    private _forceTick() {
        this._applicationRef.tick();
    }
}
