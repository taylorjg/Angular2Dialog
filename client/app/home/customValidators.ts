import {AbstractControl} from '@angular/forms';

export class CustomValidators {

    static email(c: AbstractControl): {[key: string]: any} {
        var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        if (c.value && (c.value.length <= 5 || !EMAIL_REGEXP.test(c.value))) {
            return { 'email': true };
        }
        return null;
    }
}
