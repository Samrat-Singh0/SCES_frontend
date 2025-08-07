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
  standalone: true,
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
    this.userRole = JSON.parse(localStorage.getItem("loggedInUser")!).role.roleType || '' ;
    this.pendingEnrollments = [];
  }

  ngOnInit() {
    this.populateEnrollments();
  }

  populateEnrollments() {
    this.enrollmentService.getPendingEnrollments().subscribe({
      next: res => {
        if (res.success) {
          this.pendingEnrollments = res.body;
        } else {
          this.toastr.error(res.message);
        }
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  updateEnrollment(enrollment: Enrollment, status: boolean){
    const updatedEnrollment : Enrollment = {
      ...enrollment,
      completionStatus: status ? CompletionStatus.RUNNING : CompletionStatus.REJECTED,
    };

    this.enrollmentService.updateEnroll(updatedEnrollment).subscribe({
      next: res=> {
        if(res.success){
          this.populateEnrollments();
          this.toastr.success(res.message);
        }else {
          this.toastr.error(res.message);
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
