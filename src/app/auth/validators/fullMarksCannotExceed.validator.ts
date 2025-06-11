import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export async function fullMarksCannotExceed(max: number): Promise<ValidatorFn> {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = Number(control.value);
    if(!isNaN(value) && value > max){
      return { exceedsMax:true};
    }
    return null;
  }
}
