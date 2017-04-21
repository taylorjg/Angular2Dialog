import { Component, Input, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, AbstractControl, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NameListItem } from "./nameListItem";
import { CustomValidators } from "./customValidators";

@Component({
    selector: "nameListItemModalContent",
    /* tslint:disable:max-line-length */
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>

            <div class="modal-header">
                <h2 class="modal-title">{{ title }}</h2>
                <button type="button" class="close" (click)="onCancel()" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                <div class="form-group" [ngClass]="feedbackClasses(firstNameControl)">
                    <label class="control-label" for="firstName">First name</label>
                    <input #initialFocusField type="text" id="firstName" name="firstName" class="form-control" [formControl]="firstNameControl" [(ngModel)]="firstName">
                    <span *ngIf="firstNameControl.valid && firstNameControl.touched" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                    <span *ngIf="firstNameControl.invalid && firstNameControl.touched" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                    <div *ngIf="firstNameControl.hasError('required') && firstNameControl.touched" class="help-block">Please enter your first name</div> 
                </div>
                <div class="form-group" [ngClass]="feedbackClasses(lastNameControl)">
                    <label class="control-label" for="lastName">Last name</label>
                    <input type="text" id="lastName" name="lastName" class="form-control" [formControl]="lastNameControl" [(ngModel)]="lastName">
                    <span *ngIf="lastNameControl.valid && lastNameControl.touched" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                    <span *ngIf="lastNameControl.invalid && lastNameControl.touched" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                    <div *ngIf="lastNameControl.hasError('required') && lastNameControl.touched" class="help-block">Please enter your last name</div> 
                </div>
                <div class="form-group" [ngClass]="feedbackClasses(emailControl)">
                    <label class="control-label" for="email">Email</label>
                    <input type="email" id="email" name="email" class="form-control" [formControl]="emailControl" [(ngModel)]="email">
                    <span *ngIf="emailControl.valid && emailControl.touched" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                    <span *ngIf="emailControl.invalid && emailControl.touched" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                    <div *ngIf="emailControl.hasError('required') && emailControl.touched" class="help-block">Please enter your email address</div> 
                    <div *ngIf="emailControl.hasError('email') && emailControl.touched" class="help-block">Please enter a valid email address</div> 
                </div>
            </div>

            <div class="modal-footer">
                <button type="submit" class="btn btn-sm btn-primary">Save</button>
                <button type="button" class="btn btn-sm" (click)="onCancel()">Cancel</button>
            </div>
        
        </form>`
    /* tslint:enable */
})
export class NameListItemModalContentComponent implements OnInit {
    @Input("item") public item: NameListItem;
    @ViewChild("initialFocusField") private initialFocusField: ElementRef;
    private form: FormGroup;
    private firstNameControl: AbstractControl;
    private lastNameControl: AbstractControl;
    private emailControl: AbstractControl;
    private title: string;
    private firstName: string;
    private lastName: string;
    private email: string;
    constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder) {
    }
    public ngOnInit() {
        if (this.item) {
            this.title = `Edit Item ${this.item.id}`;
            this.firstName = this.item.firstName;
            this.lastName = this.item.lastName;
            this.email = this.item.email;
        } else {
            this.title = "Add Item";
        }
        this.buildForm();
        this.initialFocusField.nativeElement.focus();
    }
    private onSubmit() {
        if (this.form.valid) {
            const item = this.item
                ? new NameListItem(
                    this.firstName,
                    this.lastName,
                    this.email,
                    this.item.id,
                    this.item.readUri,
                    this.item.updateUri,
                    this.item.deleteUri)
                : new NameListItem(
                    this.firstName,
                    this.lastName,
                    this.email);
            this.activeModal.close(item);
        }
    }
    private onCancel() {
        this.activeModal.dismiss();
    }
    private feedbackClasses(c: AbstractControl) {
        return {
            "has-feedback": c.touched,
            "has-success": c.touched && c.valid,
            "has-error": c.touched && !c.valid
        };
    }
    private buildForm(): void {
        this.form = this.formBuilder.group({
            firstName: [this.firstName, Validators.required],
            lastName: [this.lastName, Validators.required],
            email: [this.email, Validators.compose([Validators.required, CustomValidators.email])]
        });
        this.firstNameControl = this.form.controls.firstName;
        this.lastNameControl = this.form.controls.lastName;
        this.emailControl = this.form.controls.email;
        if (this.item) {
            this.firstNameControl.markAsTouched();
            this.lastNameControl.markAsTouched();
            this.emailControl.markAsTouched();
        }
    }
}
