import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, AbstractControl, Validators} from '@angular/forms';
import {ModalDirective} from 'ng2-bootstrap/ng2-bootstrap';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {NameListItem} from './nameListItem';
import {CustomValidators} from './customValidators';

@Component({
    selector: 'nameListItemModal',
    template: `
    <div bsModal #modal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form [formGroup]="myForm" (ngSubmit)="onSubmit()" novalidate>

                    <div class="modal-header">
                        <button type="button" class="close" (click)="modal.hide()" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h2 class="modal-title">{{title}}</h2>
                    </div>

                    <div class="modal-body">
                        <div class="form-group" [ngClass]="setFeedbackClasses(firstName)">
                            <label class="control-label" for="firstName">First name</label>
                            <input type="text" id="firstName" name="firstName" class="form-control" [formControl]="firstName" [(ngModel)]="item.firstName">
                            <span *ngIf="firstName.valid && firstName.touched" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                            <span *ngIf="!firstName.valid && firstName.touched" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                            <div *ngIf="firstName.hasError('required') && firstName.touched" class="help-block">Please enter your first name</div> 
                        </div>
                        <div class="form-group" [ngClass]="setFeedbackClasses(lastName)">
                            <label class="control-label" for="lastName">Last name</label>
                            <input type="text" id="lastName" name="lastName" class="form-control" [formControl]="lastName" [(ngModel)]="item.lastName">
                            <span *ngIf="lastName.valid && lastName.touched" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                            <span *ngIf="!lastName.valid && lastName.touched" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                            <div *ngIf="lastName.hasError('required') && lastName.touched" class="help-block">Please enter your last name</div> 
                        </div>
                        <div class="form-group" [ngClass]="setFeedbackClasses(email)">
                            <label class="control-label" for="email">Email</label>
                            <input type="email" id="email" name="email" class="form-control" [formControl]="email" [(ngModel)]="item.email">
                            <span *ngIf="email.valid && email.touched" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                            <span *ngIf="!email.valid && email.touched" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                            <div *ngIf="email.hasError('required') && email.touched" class="help-block">Please enter your email address</div> 
                            <div *ngIf="email.hasError('email') && email.touched" class="help-block">Please enter a valid email address</div> 
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="submit" class="btn btn-sm btn-primary">Save</button>
                        <button type="button" class="btn btn-sm" (click)="onCancel()">Cancel</button>
                    </div>
                
                </form>
            </div>
        </div>
    </div>`
})
export class NameListItemModalComponent {
    @ViewChild('modal') private modal: ModalDirective;
    private myForm: FormGroup;
    private firstName: AbstractControl;
    private lastName: AbstractControl;
    private email: AbstractControl;
    private title: string = '';
    private item: NameListItem = null;
    private currentItem$: Subject<NameListItem>= null;
    constructor(private formBuilder: FormBuilder) {
        this.item = new NameListItem();
        this.buildForm(false);
    }
    public editItem(item: NameListItem): Observable<NameListItem> {
        this.item = item;
        this.buildForm(true);
        this.title = `Edit Item ${item.id}`;
        this.modal.show();
        return this.createCurrentItem$();
    }
    public newItem(): Observable<NameListItem> {
        this.item = new NameListItem();
        this.buildForm(false);
        this.title = 'New Item';
        this.modal.show();
        return this.createCurrentItem$();
    }
    private onSubmit() {
        if (this.myForm.valid) {
            this.currentItem$.next(this.item);
            this.currentItem$.complete();
            this.currentItem$ = null;
            this.modal.hide();
        }
    }
    private onCancel() {
        this.currentItem$.complete();
        this.currentItem$ = null;
        this.modal.hide();
    }
    private setFeedbackClasses(c: AbstractControl) {
        return {
            'has-feedback': c.touched,
            'has-success': c.touched && c.valid,
            'has-error': c.touched && !c.valid
        };
    }
    private createCurrentItem$(): Subject<NameListItem> {
        if (this.currentItem$) {
            this.currentItem$.complete();
        }
        this.currentItem$ = new Subject<NameListItem>();
        return this.currentItem$;
    }
    private buildForm(editMode: boolean): void {
        this.myForm = this.formBuilder.group({
            'firstName': [this.item.firstName, Validators.compose([Validators.required])],
            'lastName': [this.item.lastName, Validators.compose([Validators.required])],
            'email': [this.item.email, Validators.compose([Validators.required, CustomValidators.email])]
        });
        this.firstName = this.myForm.controls['firstName'];
        this.lastName = this.myForm.controls['lastName'];
        this.email = this.myForm.controls['email'];
        if (editMode) {
            this.firstName.markAsTouched();
            this.lastName.markAsTouched();
            this.email.markAsTouched();
        }
    }
}
