import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatIcon} from '@angular/material/icon';
import {Enrollment} from '../../model/enrollment.model';
import {EnrollmentService} from '../../services/enrollment.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {CompletionStatus} from '../../enum/completion-status.enum';
import {PaidStatus} from '../../enum/paid-status.enum';
import {MatMiniFabButton} from '@angular/material/button';
import {Role} from '../../enum/role.enum';
import {JoinNameService} from '../../shared/join-name.service';
import {EnrollmentStatus} from '../../enum/enrollment-status.enum';

@Component({
  selector: 'app-view-enrollment',
  imports: [
    MatIcon,
    NgForOf,
    NgClass,
    NgIf,
    MatMiniFabButton,
  ],
  templateUrl: './view-enrollment.component.html',
  styleUrl: './view-enrollment.component.css'
})
export class ViewEnrollmentComponent implements OnInit{
  enrollments: Enrollment[];
  expandedRowIndex: number | null = null;
  userRole: string = '';

  constructor(
    private enrollmentService: EnrollmentService,
    private snackBar : MatSnackBar,
    private router: Router,
    public joinName: JoinNameService
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
        this.snackBar.open(err.message, "Close", {duration: 3000});
      }
    });
  }

  enroll() {
    if(this.isCurrentlyEnrolled()){
      this.snackBar.open("You are currently enrolled or have a pending enrollment.", "Close", {duration: 3000});
    }else{
      this.router.navigate(['user/enroll/save'])
    }
  }

  dropEnroll(enrollment: Enrollment) {
    const droppedEnrollment = {
      ...enrollment,
      completionStatus: CompletionStatus.DROPPED
    }

    this.enrollmentService.updateEnroll(droppedEnrollment).subscribe({
      next: value => {
        this.ngOnInit();
        this.snackBar.open(value.message, "Close", {duration: 3000});
      }, error: err => {
        this.snackBar.open(err.message, "Close", {duration: 3000});
      }
    });
  }

  completeEnroll(enrollment: Enrollment) {
    const completedEnrollment = {
      ...enrollment,
      completionStatus: CompletionStatus.COMPLETED
    }

    this.enrollmentService.updateEnroll(completedEnrollment).subscribe({
      next: value => {
        this.ngOnInit();
        this.snackBar.open(value.message, "Close", {duration: 3000});
      }, error: err => {
        this.snackBar.open(err.message, "Close", {duration: 3000});
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


  protected readonly Role = Role;
}
