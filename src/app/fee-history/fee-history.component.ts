import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Fee} from '../model/fee.model';
import {FeeService} from '../services/fee.service';
import {ToastrMsgService} from '../shared/toastr-msg.service';
import {MatIcon} from '@angular/material/icon';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-fee-history',
  imports: [
    MatIcon,
    NgForOf,
    NgIf,
  ],
  templateUrl: './fee-history.component.html',
  standalone: true,
  styleUrl: './fee-history.component.css'
})
export class FeeHistoryComponent implements OnInit{

  fees: Fee[] = [];

  constructor(
    private feeService: FeeService,
    private toastr: ToastrMsgService,
    private dialogRef: MatDialogRef<FeeHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.populateFee();
  }

  populateFee() {
    this.feeService.getFeeHistory(this.data.code).subscribe({
      next: res => {
        if(res.success){
          this.fees = res.body;
        }else{
          this.toastr.error(res.message);
        }
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  closeForm() {
    this.dialogRef.close();
  }


}
