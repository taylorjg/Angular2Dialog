import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NameListItem } from './nameListItem';
import { CustomValidators } from './customValidators';

@Component({
    selector: 'nameListItemModalContent',
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>

            <div class="modal-header">
                <button type="button" class="close" (click)="onCancel()" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <h2 class="modal-title">{{title}}</h2>
            </div>

            <div class="modal-body">
                <div class="form-group" [ngClass]="feedbackClasses(firstName)">
                    <label class="control-label" for="firstName">First name</label>
                    <input type="text" id="firstName" name="firstName" class="form-control" [formControl]="firstName" [(ngModel)]="item.firstName">
                    <span *ngIf="firstName.valid && firstName.touched" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                    <span *ngIf="!firstName.valid && firstName.touched" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                    <div *ngIf="firstName.hasError('required') && firstName.touched" class="help-block">Please enter your first name</div> 
                </div>
                <div class="form-group" [ngClass]="feedbackClasses(lastName)">
                    <label class="control-label" for="lastName">Last name</label>
                    <input type="text" id="lastName" name="lastName" class="form-control" [formControl]="lastName" [(ngModel)]="item.lastName">
                    <span *ngIf="lastName.valid && lastName.touched" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                    <span *ngIf="!lastName.valid && lastName.touched" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                    <div *ngIf="lastName.hasError('required') && lastName.touched" class="help-block">Please enter your last name</div> 
                </div>
                <div class="form-group" [ngClass]="feedbackClasses(email)">
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
        
        </form>`
})
export class NameListItemModalContentComponent implements OnInit {
    private form: FormGroup;
    private firstName: AbstractControl;
    private lastName: AbstractControl;
    private email: AbstractControl;
    private title: string;
    @Input('item') item: NameListItem;
    constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder) {
    }
    ngOnInit() {
        this.title = (this.item.id >= 0) ? `Edit Item ${this.item.id}` : 'New Item';
        this.buildForm();
    }
    private onSubmit() {
        if (this.form.valid) {
            this.activeModal.close(this.item);
        }
    }
    private onCancel() {
        this.activeModal.dismiss();
    }
    private feedbackClasses(c: AbstractControl) {
        return {
            'has-feedback': c.touched,
            'has-success': c.touched && c.valid,
            'has-error': c.touched && !c.valid
        };
    }
    private buildForm(): void {
        this.form = this.formBuilder.group({
            'firstName': [this.item.firstName, Validators.compose([Validators.required])],
            'lastName': [this.item.lastName, Validators.compose([Validators.required])],
            'email': [this.item.email, Validators.compose([Validators.required, CustomValidators.email])]
        });
        this.firstName = this.form.controls['firstName'];
        this.lastName = this.form.controls['lastName'];
        this.email = this.form.controls['email'];
        if (this.item.id >= 0) {
            this.firstName.markAsTouched();
            this.lastName.markAsTouched();
            this.email.markAsTouched();
        }
    }
}
