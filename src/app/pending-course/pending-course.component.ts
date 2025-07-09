import {Component} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Course} from '../model/course.model';
import {CourseService} from '../services/course.service';
import {JoinNameService} from '../shared/join-name.service';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {ToastrMsgService} from '../shared/toastr-msg.service';

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
    private toastr: ToastrMsgService,
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
        this.toastr.error('');
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
        this.toastr.error('');
      }
    });
  }
}
