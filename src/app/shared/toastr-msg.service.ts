import { Injectable } from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrMsgService {

  constructor(
    private toastr: ToastrService
  ) { }

  success(message: string) {
    this.toastr.success(message, "Status", {timeOut: 3000});
  }

  error(message: string | '') {
    if(message === ''){
      this.toastr.error("Something went wrong!!", "Oops", {timeOut: 3000});
    }
      this.toastr.error(message, "Oops", {timeOut: 3000});
  }

  info(message: string) {
    this.toastr.info(message, "Info", {timeOut: 3000});
  }
}
