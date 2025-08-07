import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {SpinnerService} from './spinner.service';
import {finalize} from 'rxjs';
import {AbstractControl, ValidatorFn} from '@angular/forms';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(SpinnerService);
  spinner.show();

  return next(req).pipe(
    finalize(()=> spinner.hide())
  );
};
