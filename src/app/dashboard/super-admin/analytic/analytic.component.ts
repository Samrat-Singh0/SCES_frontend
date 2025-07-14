import {Component, OnInit} from '@angular/core';
import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {AnalyticData} from '../../../model/analytic.model';
import {AnalyticsService} from '../../../services/analytics.service';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {ToastrMsgService} from '../../../shared/toastr-msg.service';

@Component({
  selector: 'app-analytic',
  imports: [
    MatIcon,
    MatCard,
    NgIf
  ],
  templateUrl: './analytic.component.html',
  standalone: true,
  styleUrl: './analytic.component.css'
})
export class AnalyticComponent implements OnInit{
  analytics: AnalyticData | null = null;
  isDataNotPopulated : boolean = true;


  constructor(
    private analyticsService: AnalyticsService,
    private toastr: ToastrMsgService,
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
        if (
          this.analytics.totalCourse !== null &&
          this.analytics.totalFee !== null &&
          this.analytics.totalInstructor !== null &&
          this.analytics.totalStudent !== null &&
          this.analytics.totalOutstandingFee !== null
        ){
          this.isDataNotPopulated = false;
        }
      }, error: err => {
        this.toastr.error(err.message);
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
