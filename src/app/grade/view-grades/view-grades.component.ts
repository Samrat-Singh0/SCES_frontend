import {Component, OnInit} from '@angular/core';
import {Course} from '../../model/course.model';
import {CourseService} from '../../services/course.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgClass, NgForOf} from '@angular/common';
import {Grade} from '../../model/grade.model';
import {Semester} from '../../model/semester.model';
import {GradeService} from '../../services/grade.service';

@Component({
  selector: 'app-view-grades',
  imports: [
    NgForOf,
    NgClass
  ],
  templateUrl: './view-grades.component.html',
  styleUrl: './view-grades.component.css'
})
export class ViewGradesComponent implements OnInit{
  courses: Course[] = [];
  semesters: Semester[] = [];
  grades: Grade[] = [];

  constructor(
    private courseService: CourseService,
    private snackBar: MatSnackBar,
    private gradeService: GradeService
  ) {
  }

  ngOnInit() {
    this.populateCourses();
    this.populateGrades();
  }

  populateCourses() {
    this.courseService.getCoursesBasedOnRole().subscribe({
      next: res => {
        this.courses = res.body;

      }, error: err => {
        this.snackBar.open(err.message, "Close", {duration: 3000});
      }
    });
  }

  populateGrades() {
    this.gradeService.getGradesStudent().subscribe({
      next: value => {
        this.grades = value.body;
      }, error: err => {
        this.snackBar.open(err.message, "Close", {duration: 3000});
      }
    });
  }

  getGradeClass(grade: number) {
    if(grade < 30){
      return 'fail-grade';
    }else{
      return 'pass-grade';
    }
  }
}
