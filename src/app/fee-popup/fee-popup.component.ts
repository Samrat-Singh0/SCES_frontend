import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {Enrollment} from '../model/enrollment.model';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {FeeService} from '../services/fee.service';
import {Fee} from '../model/fee.model';
import {ToastrMsgService} from '../shared/toastr-msg.service';

@Component({
  selector: 'app-fee-popup',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './fee-popup.component.html',
  styleUrl: './fee-popup.component.css'
})
export class FeePopupComponent {

  amount: number = 0;

  constructor(
    private toastr: ToastrMsgService,
    private feeService: FeeService,
    private dialogRef: MatDialogRef<FeePopupComponent>,
    @Inject(MAT_DIALOG_DATA)public data: {enrollment: Enrollment}
  ) {
  }

  confirmPayment() {
    if(this.validateAmount()){
      const fee: Fee = {
        enrollmentPayload: this.data.enrollment,
        amount: this.amount
      }
      this.feeService.payFee(fee).subscribe({
        next: res => {
          this.dialogRef.close();
        }, error: err => {
          this.toastr.error('');
        }
      });
    }
  }

  validateAmount(): boolean {
    if(!this.amount || !/^\d+$/.test(this.amount.toString()) || this.amount < 0 || this.amount > this.data.enrollment.outstandingFee){
      this.toastr.error('Please enter a valid numeric amount');
      return false;
    }
    return true;
  }
}
