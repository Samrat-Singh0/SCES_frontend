import {Component, OnInit} from '@angular/core';
import {Course} from '../../model/course.model';
import {CourseService} from '../../services/course.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-view-grades-instructor',
  imports: [
    MatCard,
    MatCardContent,
    MatCardTitle,
    NgForOf,
  ],
  templateUrl: './view-grades-instructor.component.html',
  styleUrl: './view-grades-instructor.component.css'
})
export class ViewGradesInstructorComponent implements OnInit{
  courses: Course[] = [];

  constructor(
    private courseService: CourseService,
    private toastr: ToastrService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.populateCourses();
  }

  populateCourses() {
    this.courseService.getCoursesBasedOnRole().subscribe({
      next: res => {
        if(res.success){
          this.courses = res.body;
        }else {
          this.toastr.error(res.message);
        }
      }, error: err => {
        this.toastr.error("Something went wrong!!", "Oops", {timeOut: 3000});
      }
    });
  }

  saveGrade(course: Course) {
    if(!course.isStudentEnrolled){
      this.toastr.error("No any student enrolled in this course.");
      return;
    }
    this.router.navigate(['super/grade/save/'+course.semester.label+'/'+course.code]);
  }
}
