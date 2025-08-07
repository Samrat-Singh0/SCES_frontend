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
import {FeeHistoryComponent} from '../../fee-history/fee-history.component';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {SearchEnrollment} from '../../model/search.model';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {CurrentUserService} from '../../shared/current-user.service';
import {User} from '../../model/user.model';

@Component({
  selector: 'app-view-enrollment',
  imports: [
    MatIcon,
    NgForOf,
    NgClass,
    NgIf,
    MatMiniFabButton,
    MatTooltip,
    MatLabel,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatSelect,
    MatOption,
  ],
  templateUrl: './view-enrollment.component.html',
  standalone: true,
  styleUrl: './view-enrollment.component.css'
})
export class ViewEnrollmentComponent implements OnInit{
  searchForm: FormGroup;
  isSearchEnabled: boolean = false;
  enrollments: Enrollment[];
  expandedRowIndex: number | null = null;
  userRole: string = '';
  protected readonly Role = Role;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 5;
  sizeSelect: number[] = [5,10,20,50,100]
  user: User;


  constructor(
    private enrollmentService: EnrollmentService,
    private toastr : ToastrMsgService,
    private router: Router,
    public joinName: JoinNameService,
    private dialogRef: MatDialog,
    private builder: FormBuilder,
    private currentUser: CurrentUserService
  ) {
    this.searchForm = new FormGroup({});
    this.enrollments = [];
    this.user = this.currentUser.getUser();
  }

  ngOnInit() {
    this.userRole = JSON.parse(localStorage.getItem("loggedInUser")!).role.roleType || '';
    this.renderContent(this.currentPage);
    this.buildForm();
  }

  renderContent(page: number = 0){
    let studentName: string = this.searchForm.value.studentName || null;
    let semester: string = this.searchForm.value.semester || null;
    let payStatus: string = this.searchForm.value.payStatus || null;

    const searchCriteria: SearchEnrollment = {
      studentName: studentName,
      semester: semester,
      payStatus: payStatus
    }


    this.enrollmentService.getPagedEnrollments(searchCriteria, page, this.pageSize).subscribe({
      next: res => {
        if(res.success){
          this.enrollments = res.body.content;
          this.totalPages = res.body.totalPages;
          this.currentPage = res.body.number;
        }else{
          this.toastr.error(res.message);
        }

      },error: err => {
        this.toastr.error('');
      }
    });
  }

  buildForm() {
    this.searchForm = this.builder.group({
      studentName: [undefined, Validators.pattern("^[a-zA-Z\\s]+$")],
      semester: [undefined, Validators.pattern("^[a-zA-Z\\s]+$")],
      payStatus: [undefined]
    });
  }

  enroll() {
    if(this.isCurrentlyEnrolled()){
      this.toastr.error("You are currently enrolled or have a pending enrollment");
    }else{
      this.router.navigate(['student/enroll/save'])
    }
  }

  updateEnroll(enrollment: Enrollment, isEnrollmentCompleted: boolean) {
    const updatedEnrollment = {
      ...enrollment,
      completionStatus: isEnrollmentCompleted ? CompletionStatus.COMPLETED : CompletionStatus.DROPPED
    }

    const dialogRef = this.dialogRef.open(ConfirmationComponent, {
      width: '600px',
      maxWidth: 'none',
      disableClose: true,
      data: {
        title: isEnrollmentCompleted ? 'Mark Complete?' : 'Drop Course?',
        message: isEnrollmentCompleted ? 'Are you sure?' : 'Are you sure you want to drop this course? Please mind your account will be deactivated if u proceed to drop.',
        requireRemarks: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result?.confirmed) {
        this.enrollmentService.updateEnroll(updatedEnrollment).subscribe({
          next: res => {
            if(res.success){
              if(!isEnrollmentCompleted) {
                localStorage.clear();
                this.router.navigate(['login'])
              }else {
                this.renderContent(this.currentPage);
                this.toastr.success(res.message);
              }
            }else{
              this.toastr.error(res.message);
            }
          }, error: err => {
            this.toastr.error('');
          }
        });
      }
    });
  }

  isCurrentlyEnrolled(): boolean{
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
      height: '350px',
      data: { enrollment }
    });

    dialogRef.afterClosed().subscribe(res=>{
      this.renderContent(this.currentPage);
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

  goToPage(page: number): void {
    if(page >= 0 && page < this.totalPages){
      this.renderContent(page);
    }
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.renderContent(this.currentPage);
  }

  resetSearchForm() {
    this.searchForm.reset();
    this.isSearchEnabled = false;
    this.renderContent(this.currentPage);
  }

  isButtonVisible(i: number, currentPage: number): boolean {
    console.log(currentPage);
    if(currentPage === 0) {
      return i === currentPage || i === currentPage + 1 || i === currentPage + 2;
    }

    if(currentPage === this.totalPages-1) {
      return i === currentPage || i === currentPage - 1 || i === currentPage - 2;
    }
    return i === currentPage - 1 || i === currentPage + 1 || i === currentPage;

  }
}
