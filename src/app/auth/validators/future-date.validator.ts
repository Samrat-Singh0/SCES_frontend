import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if(!control.value){
      return null;
    }
    const selectedDate = new Date(control.value);
    const today = new Date();
    if(selectedDate > today){
      return null;
    }
    return {futureDate: true};
  }
}
