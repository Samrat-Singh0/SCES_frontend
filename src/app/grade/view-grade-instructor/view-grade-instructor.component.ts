import {Component, OnInit} from '@angular/core';
import {Course} from '../../model/course.model';
import {CourseService} from '../../services/course.service';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {NgForOf} from '@angular/common';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-view-grade-instructor',
  imports: [
    MatCard,
    MatCardContent,
    MatCardTitle,
    NgForOf
  ],
  templateUrl: './view-grade-instructor.component.html',
  standalone: true,
  styleUrl: './view-grade-instructor.component.css'
})
export class ViewGradeInstructorComponent implements OnInit{
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
        this.courses = res.body;
      }, error: err => {
        this.toastr.error("Something went wrong!!", "Oops", {timeOut: 3000});
      }
    });
  }

  saveGrade(course: Course) {
    this.router.navigate(['instructor/grade/save/'+''+course.code]);
  }

}
