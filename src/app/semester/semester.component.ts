import {Component} from '@angular/core';
import {Semester} from '../model/semester.model';
import {SemesterService} from '../services/semester.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatMiniFabButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {SemesterStateService} from '../shared/semester-state.service';

@Component({
  selector: 'app-semester',
  imports: [
    NgForOf,
    MatIcon,
    FormsModule,
    MatMiniFabButton,
    NgIf
  ],
  templateUrl: './semester.component.html',
  styleUrl: './semester.component.css'
})
export class SemesterComponent {

  semesters: Semester[] = [];

  constructor(
    private semesterService: SemesterService,
    private snackBar: MatSnackBar,
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
          this.snackBar.open(err.message,"Close", {duration: 3000});
      }
    });
  }

  addSemester() {
    if(this.semesters.length >= 8){
      this.snackBar.open("Cannot add more than 8 semesters.", "Close", {duration: 3000});
    }else{
      this.router.navigate(['super/add']);
    }
  }


  updateSemester(semester: Semester) {
    this.semesterState.setSemester(semester);
    this.router.navigate(['super/edit'],{
      queryParams: {label: semester.label}
    });
  }


  deleteSemester(label: string) {
    this.semesterService.delete(label).subscribe({
      next: res => {
        this.ngOnInit();
        this.snackBar.open(res.message, "Close", {duration: 3000});
      }, error: err=> {
        this.snackBar.open(err.message, "Close", {duration: 3000});
      }
    });
  }

}
