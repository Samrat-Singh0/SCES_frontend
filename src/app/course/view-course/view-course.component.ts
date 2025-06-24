import {Component, OnInit} from '@angular/core';
import {CourseService} from '../../services/course.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {Course} from '../../model/course.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {MatMiniFabButton} from '@angular/material/button';
import {SearchCourse} from '../../model/search.model';
import {JoinNameService} from '../../shared/join-name.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationComponent} from '../../shared/confirmation/confirmation.component';

@Component({
  selector: 'app-view-course',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatIcon,
    MatIconModule,
    NgForOf,
    MatMiniFabButton,
    NgIf
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

  constructor(
    private courseService: CourseService,
    private builder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    public joinName: JoinNameService,
    private dialog: MatDialog
  ) {
    this.searchForm = new FormGroup({});
    this.courses = [];
  }

  ngOnInit() {
    this.renderContent(this.currentPage);
    this.buildForm();
  }

  renderContent(page: number) {
    this.courseService.getPagedCourses(page, this.pageSize).subscribe({
      next: res => {
        this.courses = res.body.content;
        this.totalPages = res.body.totalPages;
        this.currentPage = res.body.number;
      }, error: err => {
        this.snackBar.open(err.message, "Close", {duration: 3000})
      }
    });
  }

  buildForm() {
    this.searchForm = this.builder.group({
      name: [undefined, Validators.pattern("^[a-zA-Z\\s]+$\n")],
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
            this.snackBar.open(res.message, "Close", {duration: 3000});
          }, error: err => {
            this.snackBar.open(err.message, "Close", {duration: 3000});
          }
        });
      }
    });
  }


  searchCourse() {
    let name: string = this.searchForm.value.name || undefined;
    let instructor: string = this.searchForm.value.instructor || undefined;
    let semester: string = this.searchForm.value.semester || undefined;

    const searchCriteria: SearchCourse = {
      name: name,
      instructor: instructor,
      semester: semester
    }

    this.courseService.searchCourse(searchCriteria).subscribe({
      next: res => {
        this.courses = res.body;
      }, error: err => {
        console.log(err.message);
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
}
