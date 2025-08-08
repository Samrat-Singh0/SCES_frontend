import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function feeValidator(): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null=> {
    if(control.value === null || control.value === '') return null;

    if (isNaN(control.value)) return { feeValidator: true };

    let fee = Number(control.value);
    return fee < 1000 || fee > 1000000 ? {feeValidator : true} : null;
  }
}
