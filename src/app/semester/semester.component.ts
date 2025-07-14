import {Component} from '@angular/core';
import {Semester} from '../model/semester.model';
import {SemesterService} from '../services/semester.service';
import {NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatMiniFabButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {SemesterStateService} from '../shared/semester-state.service';
import {MatTooltip} from '@angular/material/tooltip';
import {ToastrMsgService} from '../shared/toastr-msg.service';

@Component({
  selector: 'app-semester',
  imports: [
    NgForOf,
    MatIcon,
    FormsModule,
    MatMiniFabButton,
    MatTooltip,
    NgIf
  ],
  templateUrl: './semester.component.html',
  standalone: true,
  styleUrl: './semester.component.css'
})
export class SemesterComponent {

  semesters: Semester[] = [];

  constructor(
    private semesterService: SemesterService,
    private toastr: ToastrMsgService,
    private router: Router,
    private semesterState: SemesterStateService
    ) {
  }

  ngOnInit() {
    this.loadSemesters();
  }

  loadSemesters() {
    this.semesterService.getAll().subscribe({
      next: (data) => {
        this.semesters = data.body;
      }, error: (err) => {
          this.toastr.error('');
      }
    });
  }

  addSemester() {
    if(this.semesters.length >= 8){
      this.toastr.error('Cannot add more than 8 semesters.')
    }else{
      this.router.navigate(['super/semester/add']);
    }
  }


  updateSemester(semester: Semester) {
    this.semesterState.setSemester(semester);
    this.router.navigate(['super/semester/edit'],{
      queryParams: {label: semester.label}
    });
  }

}
