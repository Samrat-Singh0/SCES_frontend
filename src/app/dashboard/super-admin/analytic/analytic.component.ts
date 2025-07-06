import {Component, OnInit} from '@angular/core';
import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {AnalyticData} from '../../../model/analytic.model';
import {AnalyticsService} from '../../../services/analytics.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-analytic',
  imports: [
    MatIcon,
    MatCard
  ],
  templateUrl: './analytic.component.html',
  styleUrl: './analytic.component.css'
})
export class AnalyticComponent implements OnInit{
  analytics: AnalyticData | null = null;


  constructor(
    private analyticsService: AnalyticsService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.populateData();
  }

  populateData() {
    this.analyticsService.getAnalyticData().subscribe({
      next: res => {
        this.analytics = res.body;
      }, error: err => {
        this.snackBar.open(err.message, "Close", {duration: 3000})
      }
    });
  }

  goToCourse() {
    this.router.navigate(['super/course/view']);
  }

  goToUser() {
    this.router.navigate(['super/user/view']);
  }

  goToSemester() {
    this.router.navigate(['super/semester/view'])
  }

  goToEnrollment() {
    this.router.navigate(['super/enroll/view'])
  }

}
