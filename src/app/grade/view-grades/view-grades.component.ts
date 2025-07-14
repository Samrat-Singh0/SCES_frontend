import {Component, OnInit} from '@angular/core';
import {Course} from '../../model/course.model';
import {CourseService} from '../../services/course.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Grade} from '../../model/grade.model';
import {Semester} from '../../model/semester.model';
import {GradeService} from '../../services/grade.service';
import {ToastrMsgService} from '../../shared/toastr-msg.service';

@Component({
  selector: 'app-view-grades',
  imports: [
    NgForOf,
    NgClass,
    NgIf
  ],
  templateUrl: './view-grades.component.html',
  standalone: true,
  styleUrl: './view-grades.component.css'
})
export class ViewGradesComponent implements OnInit{
  courses: Course[] = [];
  grades: Grade[] = [];

  constructor(
    private courseService: CourseService,
    private toastr: ToastrMsgService,
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
        this.toastr.error('');
      }
    });
  }

  populateGrades() {
    this.gradeService.getGradesStudent().subscribe({
      next: value => {
        this.grades = value.body;
      }, error: err => {
        this.toastr.error('');
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
