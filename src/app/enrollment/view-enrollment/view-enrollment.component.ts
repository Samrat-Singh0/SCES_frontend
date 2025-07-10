import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatIcon} from '@angular/material/icon';
import {Enrollment} from '../../model/enrollment.model';
import {EnrollmentService} from '../../services/enrollment.service';
import {Router} from '@angular/router';
import {CompletionStatus} from '../../enum/completion-status.enum';
import {PaidStatus} from '../../enum/paid-status.enum';
import {MatMiniFabButton} from '@angular/material/button';
import {Role} from '../../enum/role.enum';
import {JoinNameService} from '../../shared/join-name.service';
import {EnrollmentStatus} from '../../enum/enrollment-status.enum';
import {MatTooltip} from '@angular/material/tooltip';
import {MatDialog} from '@angular/material/dialog';
import {FeePopupComponent} from '../../fee-popup/fee-popup.component';
import {ToastrMsgService} from '../../shared/toastr-msg.service';
import {ConfirmationComponent} from '../../shared/confirmation/confirmation.component';
import {FeeService} from '../../services/fee.service';
import {FeeHistoryComponent} from '../../fee-history/fee-history.component';

@Component({
  selector: 'app-view-enrollment',
  imports: [
    MatIcon,
    NgForOf,
    NgClass,
    NgIf,
    MatMiniFabButton,
    MatTooltip,
  ],
  templateUrl: './view-enrollment.component.html',
  styleUrl: './view-enrollment.component.css'
})
export class ViewEnrollmentComponent implements OnInit{
  enrollments: Enrollment[];
  expandedRowIndex: number | null = null;
  userRole: string = '';
  protected readonly Role = Role;

  constructor(
    private enrollmentService: EnrollmentService,
    private toastr : ToastrMsgService,
    private router: Router,
    public joinName: JoinNameService,
    private dialogRef: MatDialog,
    private feeService: FeeService
  ) {
    this.enrollments = [];
  }

  ngOnInit() {
    this.userRole = localStorage.getItem('role') || '';
    this.renderContent();
  }

  renderContent(){
    this.enrollmentService.getEnrollments().subscribe({
      next: res => {
        this.enrollments = res.body;

      },error: err => {
        this.toastr.error('');
      }
    });
  }

  enroll() {
    if(this.isCurrentlyEnrolled()){
      this.toastr.error("You are currently enrolled or have a pending enrollment");
    }else{
      this.router.navigate(['student/enroll/save'])
    }
  }

  dropEnroll(enrollment: Enrollment) {
    const droppedEnrollment = {
      ...enrollment,
      completionStatus: CompletionStatus.DROPPED
    }

    const dialogRef = this.dialogRef.open(ConfirmationComponent, {
      width: '600px',
      maxWidth: 'none',
      disableClose: true,
      data: {
        title: 'Drop Course',
        message: 'Are you sure you want to drop this course?',
        requireRemarks: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result?.confirmed) {
        this.enrollmentService.updateEnroll(droppedEnrollment).subscribe({
          next: value => {
            this.ngOnInit();
            this.toastr.success(value.message);
          }, error: err => {
            this.toastr.error('');
          }
        });
      }
    });
  }

  completeEnroll(enrollment: Enrollment) {
    const completedEnrollment = {
      ...enrollment,
      completionStatus: CompletionStatus.COMPLETED
    }

    const dialogRef = this.dialogRef.open(ConfirmationComponent, {
      width: '600px',
      maxWidth: 'none',
      disableClose: true,
      data: {
        title: 'Complete Enrollment',
        message:"Are you sure you want to mark this enrollment as `COMPLETE`?",
        requireRemarks: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result?.confirmed) {
        this.enrollmentService.updateEnroll(completedEnrollment).subscribe({
          next: value => {
            this.ngOnInit();
            this.toastr.success(value.message);
          }, error: err => {
            this.toastr.success('(err.message');
          }
        });
      }
    });
  }

  isCurrentlyEnrolled(): boolean{
    // for(let enrollment of this.enrollments){
    //   if(enrollment.completionStatus == "RUNNING"){
    //     return true;
    //   }
    // }
    // return false;

    return this.enrollments.some(enrollment => (enrollment.completionStatus === CompletionStatus.RUNNING || enrollment.completionStatus === CompletionStatus.PENDING));
  }

  getStatusClass(status: string) {
    switch (status) {
      case EnrollmentStatus.ENROLLED:
      case PaidStatus.PAID:
      case CompletionStatus.RUNNING:
        return 'status-green';
      case EnrollmentStatus.QUIT:
      case PaidStatus.UNPAID:
      case CompletionStatus.DROPPED:
        return 'status-red';
      case PaidStatus.PARTIALLY_PAID:
      case EnrollmentStatus.GRADUATED:
      case CompletionStatus.COMPLETED:
        return 'status-blue';
      case CompletionStatus.PENDING:
      case EnrollmentStatus.NEW:
        return 'status-yellow';
      default:
        return 'status-reject-red';
    }
  }

  toggleRow(index: number) {
    this.expandedRowIndex = this.expandedRowIndex === index ? null : index;
  }

  isDisabled(enrollment: Enrollment): boolean {
    return (
      enrollment.completionStatus !== CompletionStatus.RUNNING
    )
  }

  isNotPayable(enrollment: Enrollment): boolean {
    return (
      enrollment.completionStatus === CompletionStatus.DROPPED ||
      enrollment.completionStatus === CompletionStatus.REJECTED ||
      enrollment.completionStatus === CompletionStatus.PENDING ||
      enrollment.paidStatus === PaidStatus.PAID
    );
  }

  payFee(enrollment: Enrollment) {
    const dialogRef = this.dialogRef.open(FeePopupComponent, {
      width: '400px',
      data: { enrollment }
    });

    dialogRef.afterClosed().subscribe(res=>{
      this.renderContent();
    });
  }

  getPayStatus(status: string): string {
    switch (status) {
      case PaidStatus.PAID:
        return "Paid";
      case PaidStatus.UNPAID:
        return "Unpaid";
      case PaidStatus.PARTIALLY_PAID:
        return "Partially Paid";
      default:
        return "<ERR>";
    }

  }
  getCompletionStatus(status: string): string {
    switch (status) {
      case CompletionStatus.COMPLETED:
        return "Completed";
      case CompletionStatus.PENDING:
        return "Pending";
      case CompletionStatus.DROPPED:
        return "Dropped";
      case CompletionStatus.RUNNING:
        return "Running";
      case CompletionStatus.REJECTED:
        return "Rejected";
      default:
        return "<ERR>";
    }

  }

  getFeeHistory(enrollment: Enrollment) {
    const dialogRef = this.dialogRef.open(FeeHistoryComponent, {
      disableClose: false,
      data: enrollment
    });
  }


}
