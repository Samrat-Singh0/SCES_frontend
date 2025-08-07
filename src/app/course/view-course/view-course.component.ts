import {Component, OnInit} from '@angular/core';
import {CourseService} from '../../services/course.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {Course} from '../../model/course.model';
import {NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {MatMiniFabButton} from '@angular/material/button';
import {SearchCourse} from '../../model/search.model';
import {JoinNameService} from '../../shared/join-name.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationComponent} from '../../shared/confirmation/confirmation.component';
import {GenerateDownloadLinkService} from '../../shared/generate-download-link.service';
import {MatTooltip} from '@angular/material/tooltip';
import {
  ReportDownloadDialogComponent
} from '../../report-download-dialog/report-download-dialog.component';
import {ReportService} from '../../services/report.service';
import {ReportRequest} from '../../model/report-request.model';
import {MatFormField} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {ToastrMsgService} from '../../shared/toastr-msg.service';

@Component({
  selector: 'app-view-course',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatIcon,
    MatIconModule,
    NgForOf,
    MatMiniFabButton,
    NgIf,
    MatTooltip,
    MatFormField,
    MatOption,
    MatSelect,
  ],
  templateUrl: './view-course.component.html',
  standalone: true,
  styleUrl: './view-course.component.css'
})
export class ViewCourseComponent implements OnInit {
  searchForm: FormGroup;
  courses: Course[];
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 5;
  sizeSelect: number[] = [5,10,20,50,100]

  constructor(
    private courseService: CourseService,
    private builder: FormBuilder,
    private toastr: ToastrMsgService,
    private router: Router,
    public joinName: JoinNameService,
    private dialog: MatDialog,
    private reportService: ReportService,
    private generateDownloadLinkService: GenerateDownloadLinkService
  ) {
    this.searchForm = new FormGroup({});
    this.courses = [];
  }

  ngOnInit() {
    this.renderContent(this.currentPage);
    this.buildForm();
  }

  renderContent(page: number) {

      let name: string = this.searchForm.value.name || null;
      let instructor: string = this.searchForm.value.instructor || null;
      let semester: string = this.searchForm.value.semester || null;

      const searchCriteria: SearchCourse = {
        name: name,
        instructor: instructor,
        semester: semester
      }

      this.courseService.getPagedCourses(searchCriteria, page, this.pageSize).subscribe({
        next: res => {
          if(res.success){
            this.courses = res.body.content;
            this.totalPages = res.body.totalPages;
            this.currentPage = res.body.number;
          }else {
            this.toastr.error(res.message);
          }
        }, error: err => {
          this.toastr.error('');
        }
      });
  }

  buildForm() {
    this.searchForm = this.builder.group({
      name: [undefined, Validators.pattern("^[a-zA-Z\\s]+$")],
      instructor: [undefined, Validators.pattern("^[a-zA-Z\\s]+$")],
      semester: [undefined, Validators.pattern("^[a-zA-Z]*$")]
    });
  }

  updateCourse(code: string) {
    this.router.navigate(['super/course/save'],{
      queryParams : {
        code: code
      }
    });
  }

  deleteCourse(code: string){
    this.openConfirmDialog(code);
  }

  openConfirmDialog(code: string){
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '600px',
      maxWidth: 'none',
      disableClose: true,
      data: {
        title: 'Delete Course',
        message: 'Are you sure you want to delete the course?',
        requireRemarks: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result?.confirmed){
        this.courseService.deleteCourse(code, result?.remarks).subscribe({
          next: res => {
            if(res.success){
              this.ngOnInit();
              this.toastr.success(res.message);
            }else {
              this.toastr.error(res.message);
            }
          }, error: err => {
            this.toastr.error('');
          }
        });
      }
    });
  }

  resetSearchForm() {
    this.searchForm.reset();
    this.renderContent(this.currentPage);
  }

  goToPage(page: number): void {
    if(page >= 0 && page < this.totalPages){
      this.renderContent(page);
    }
  }

  isSearchDisabled(): boolean {
    const values = this.searchForm.value;
    return !values.name && !values.instructor && !values.semester;
  }

  downloadReport(documentType: string | null, course: Course | null) {
    const reportDto: ReportRequest = {
      documentType: documentType || null,
      courseCode: course?.code || null,
    }

    if(course !== null) {
      const dialogRef = this.dialog.open(ReportDownloadDialogComponent, {
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(format => {
        if(format) {
          reportDto.documentType = format
          if(format !== 'cancel'){
            this.sendDownloadRequest(reportDto);
          }
        }
      });
    }else {
      this.sendDownloadRequest(reportDto);
    }
  }

  sendDownloadRequest(reportDto: ReportRequest) {
    this.reportService.downloadCourseReport(reportDto).subscribe({
      next: value => {
        if(value.status < 200 || value.status >=300) {
          this.toastr.error('');
          return;
        }
        const file = value.body!;
        let fileName: string = '';
        if(reportDto.documentType === 'PDF'){
          fileName = reportDto.courseCode !== null ? 'grade-report.pdf' : 'course-report.pdf';
        }else {
          fileName = reportDto.courseCode !== null ? 'grade-report.xlsx' : 'course-report.xlsx';
        }
        this.generateDownloadLinkService.generateLink(file, fileName);
        this.toastr.success("Download Complete");
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
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
