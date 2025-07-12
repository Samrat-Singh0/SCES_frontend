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
  styleUrl: './view-course.component.css'
})
export class ViewCourseComponent implements OnInit {
  searchForm: FormGroup;
  courses: Course[];
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 5;
  isSearchEnabled: boolean = false;
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
    if(this.isSearchEnabled){
      this.searchCourse(page);
    }else {
      this.courseService.getPagedCourses(page, this.pageSize).subscribe({
        next: res => {
          this.courses = res.body.content;
          this.totalPages = res.body.totalPages;
          this.currentPage = res.body.number;
        }, error: err => {
          this.toastr.error('');
        }
      });
    }
  }

  buildForm() {
    this.searchForm = this.builder.group({
      name: [undefined, Validators.pattern("^[a-zA-Z\\s]+$")],
      instructor: [undefined, Validators.pattern("^[a-zA-Z\\s]+$")],
      semester: [undefined, Validators.pattern("^[a-zA-Z]*$")]
    });
  }


  addCourse() {
    this.router.navigate(['super/course/save'])
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
            this.ngOnInit();
            this.toastr.success(res.message);
          }, error: err => {
            this.toastr.error('');
          }
        });
      }
    });
  }


  searchCourse(page:number = 0) {
    this.isSearchEnabled = true;
    let name: string = this.searchForm.value.name || undefined;
    let instructor: string = this.searchForm.value.instructor || undefined;
    let semester: string = this.searchForm.value.semester || undefined;

    const searchCriteria: SearchCourse = {
      name: name,
      instructor: instructor,
      semester: semester
    }

    this.courseService.searchCourse(searchCriteria, page, this.pageSize).subscribe({
      next: res => {
        this.courses = res.body.content;
        this.totalPages = res.body.totalPages;
        this.currentPage = res.body.number;
      }, error: err => {
        console.log(err.message);
      }
    });
  }

  resetSearchForm() {
    this.searchForm.reset();
    this.isSearchEnabled = false;
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
    this.reportService.downloadReport(reportDto).subscribe({
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

}
