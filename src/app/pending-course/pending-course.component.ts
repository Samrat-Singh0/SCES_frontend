import {Component} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Course} from '../model/course.model';
import {CourseService} from '../services/course.service';
import {JoinNameService} from '../shared/join-name.service';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {ToastrMsgService} from '../shared/toastr-msg.service';
import {CurrentUserService} from '../shared/current-user.service';

@Component({
  selector: 'app-pending-course',
  imports: [
    NgForOf,
    MatIcon,
    MatIconButton,
    NgIf
  ],
  templateUrl: './pending-course.component.html',
  standalone: true,
  styleUrl: './pending-course.component.css'
})
export class PendingCourseComponent {

  courses: Course[];
  user:any ;

  constructor(
    private courseService: CourseService,
    private toastr: ToastrMsgService,
    public joinName: JoinNameService,
    public currentUser: CurrentUserService
  ) {
    this.courses = [];
    this.user = this.currentUser.getUser();
  }

  ngOnInit() {
    this.renderContent();
  }

  renderContent() {
    this.courseService.getPendingCourses().subscribe({
      next: res => {
        if(res.success){
          this.courses = res.body;
        }else {
          this.toastr.error(res.message);
        }
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
        if(res.success){
          this.toastr.success(res.message);
          this.renderContent();
        }else {
          this.toastr.error(res.message);
        }
      }, error: err =>{
        this.toastr.error('');
      }
    });
  }

  isCourseAddedByLoggedInUser(addedByUserName: string): boolean {
    return addedByUserName === this.joinName.getFullName(this.user.firstName, this.user.middleName, this.user.lastName);
  }
}
