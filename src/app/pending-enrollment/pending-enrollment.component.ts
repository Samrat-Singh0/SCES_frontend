import {Component, OnInit} from '@angular/core';
import {Enrollment} from '../model/enrollment.model';
import {EnrollmentService} from '../services/enrollment.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {JoinNameService} from '../shared/join-name.service';
import {EnrollmentStatus} from '../enum/enrollment-status.enum';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {CompletionStatus} from '../enum/completion-status.enum';
import {ToastrMsgService} from '../shared/toastr-msg.service';

@Component({
  selector: 'app-pending-enrollment',
  imports: [
    NgForOf,
    NgIf,
    NgClass,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './pending-enrollment.component.html',
  styleUrl: './pending-enrollment.component.css'
})
export class PendingEnrollmentComponent implements OnInit{
  pendingEnrollments: Enrollment[];
  userRole: String = '';
  expandedRowIndex: number | null = null;

  constructor(
    private enrollmentService: EnrollmentService,
    private toastr: ToastrMsgService,
    public joinName: JoinNameService
  ) {
    this.userRole = localStorage.getItem('role') || '' ;
    this.pendingEnrollments = [];
  }

  ngOnInit() {
    this.populateEnrollments();
  }

  populateEnrollments() {
    this.enrollmentService.getPendingEnrollments().subscribe({
      next: res => {
        this.pendingEnrollments = res.body;
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  acceptEnroll(enrollment: Enrollment) {
    const acceptedEnrollment : Enrollment = {
      ...enrollment,
      completionStatus: CompletionStatus.RUNNING,
    };
    this.updateEnroll(acceptedEnrollment, true);

  }

  rejectEnroll(enrollment: Enrollment) {
    const rejectedEnroll : Enrollment = {
      ...enrollment,
      completionStatus: CompletionStatus.REJECTED,
    };
    this.updateEnroll(rejectedEnroll, false);
  }

  updateEnroll(enrollment: Enrollment, status: boolean){
    this.enrollmentService.updateEnroll(enrollment).subscribe({
      next: res=> {
        this.ngOnInit();
        if(status){
          this.toastr.success("Enrollment Accepted");
        }else {
          this.toastr.error('');
        }
      }, error:err => {
        this.toastr.error('');
      }
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case EnrollmentStatus.ENROLLED:
        return 'status-green';
      case EnrollmentStatus.QUIT:
        return 'status-red';
      case EnrollmentStatus.GRADUATED:
        return 'status-blue';
      case EnrollmentStatus.NEW:
        return 'status-yellow';
      default:
        return 'status-reject-red';
    }
  }

  toggleRow(index: number) {
    this.expandedRowIndex = this.expandedRowIndex === index ? null : index;
  }
}
