import {Component} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Course} from '../model/course.model';
import {CourseService} from '../services/course.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {JoinNameService} from '../shared/join-name.service';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-pending-course',
  imports: [
    NgForOf,
    MatIcon,
    MatIconButton,
    NgIf
  ],
  templateUrl: './pending-course.component.html',
  styleUrl: './pending-course.component.css'
})
export class PendingCourseComponent {
  courses: Course[];

  constructor(
    private courseService: CourseService,
    private snackBar: MatSnackBar,
    public joinName: JoinNameService
  ) {
    this.courses = [];
  }

  ngOnInit() {
    this.renderContent();
  }

  renderContent() {
    this.courseService.getPendingCourses().subscribe({
      next: res => {
        this.courses = res.body;
      }, error: err => {
        this.snackBar.open(err.message, "Close", {duration: 3000})
      }
    });
  }

  acceptCourse(course: Course){
    const updatedCourse: Course = {
      ...course,
      checked: 'CHECKED'
    }
    this.updateCourse(updatedCourse);

  }

  rejectCourse(course: Course){
    const updatedCourse: Course = {
      ...course,
      checked: 'REJECTED'
    }
    this.updateCourse(updatedCourse);
  }

  updateCourse(updatedCourse: Course) {
    this.courseService.updateCourse(updatedCourse).subscribe({
      next: res => {
        this.ngOnInit();
      }, error: err =>{
        this.snackBar.open(err.message, "Close", {duration: 3000});
      }
    });
  }
}
