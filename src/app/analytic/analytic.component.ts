import {Component, OnInit} from '@angular/core';
import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {AnalyticData} from '../model/analytic.model';
import {AnalyticsService} from '../services/analytics.service';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {ToastrMsgService} from '../shared/toastr-msg.service';
import {Role} from '../enum/role.enum';

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
  currentUser: any;

  constructor(
    private analyticsService: AnalyticsService,
    private toastr: ToastrMsgService,
    private router: Router
  ) {
    this.currentUser = JSON.parse(localStorage.getItem("loggedInUser")!);
  }

  ngOnInit() {
    this.populateData();
  }

  populateData() {
    this.analyticsService.getAnalyticData().subscribe({
      next: res => {
        if(res.success){
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
        }else {
          this.toastr.error(res.message);
        }
      }, error: err => {
        this.toastr.error(err.message);
      }
    });
  }

  goToCourse() {
    this.router.navigate(['super/course']);
  }

  goToUser() {
    this.router.navigate(['super/user']);
  }

  goToSemester() {
    this.router.navigate(['super/semester'])
  }

  goToEnrollment() {
    this.router.navigate(['super/enroll'])
  }

  getOnboardedDate(date: Date | null | undefined): string {
    if (!date) {
      return "#NA";
    }

    let formattedDate = new Date(date).toISOString().split('T')[0];
    const today: Date = new Date();
    const todayStr: string = new Date(today).toISOString().split('T')[0];

    if(todayStr === formattedDate) {
      return "Today";
    }

    let yesterday = new Date();
    yesterday.setDate(today.getDate() -1);
    const yesterdayStr: string =  new Date(yesterday).toISOString().split('T')[0];

    if(formattedDate === yesterdayStr) {
      return "Yesterday";
    }

    const targetDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffInTime = today.getTime() - targetDate.getTime();
    return (diffInTime / (1000 * 60 * 60 * 24)) + ' days ago';

  }


  protected readonly Role = Role;
}
