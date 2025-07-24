import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
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
import {ToastrMsgService} from '../shared/toastr-msg.service';
import {ConfirmationComponent} from '../shared/confirmation/confirmation.component';
import {PayFee} from '../model/pay-fee.model';

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
  standalone: true,
  styleUrl: './fee-popup.component.css'
})
export class FeePopupComponent implements OnInit {

  amount: number | null= null;
  isAmountValid: boolean = false;
  thresholdPercent: number = 50;
  minimumAmount: number = 0;

  constructor(
    private toastr: ToastrMsgService,
    private feeService: FeeService,
    private dialogRef: MatDialogRef<FeePopupComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)public data: {enrollment: Enrollment}
  ) {

  }

  ngOnInit() {
    this.setMinimumAmount();
  }

  setMinimumAmount() {
    const outstandingFee = this.data.enrollment.outstandingFee;
    this.minimumAmount = this.data.enrollment.semester.fee * this.thresholdPercent/100;
    if(outstandingFee < this.minimumAmount) {
      this.minimumAmount = 0;
    }
  }

  confirmPayment() {
    if(this.isAmountValid){
      const fee: PayFee = {
        enrollmentPayload: this.data.enrollment,
        amount: this.amount!
      }

      const dialog = this.dialog.open(ConfirmationComponent, {
        width: '600px',
        maxWidth: 'none',
        disableClose: true,
        data: {
          title: 'Payment',
          message:"Are you sure you want to pay the specified amount?",
          requireRemarks: false
        }
      });

      dialog.afterClosed().subscribe(result => {
        if(result?.confirmed){
          this.feeService.payFee(fee).subscribe({
            next: res => {
              this.dialogRef.close();
            }, error: err => {
              this.toastr.error('');
            }
          });
        }
      });
    }
  }

  validateAmount(): boolean {
    if(this.amount! < 0){
      this.toastr.error("Please add a positive numeric amount");
      return false;
    }
    if(!this.amount || !/^\d+$/.test(this.amount.toString())){
      this.toastr.error('Please enter a valid numeric amount');
      return false;
    }
    if(this.amount > this.data.enrollment.outstandingFee) {
      this.toastr.error("Your amount cannot exceed the outstanding amount");
      return false;
    }
    if(this.amount < this.minimumAmount) {
      this.toastr.error("Your amount must be greater than minimum amount");
      return false;
    }
    return true;
  }

  getColor(): string {
    if(this.isAmountValid) {
      return "primary";
    }else {
      return "warn";
    }
  }

  updateButtonValidity() {
    this.isAmountValid = this.validateAmount();
  }

}
