import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {JoinNameService} from '../../../shared/join-name.service';
import {CurrentUserService} from '../../../shared/current-user.service';

@Component({
  selector: 'app-user-dashboard',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {

  protected currentUser: any;

  constructor(
    private router: Router,
    public joinName: JoinNameService,
    private loggedInUser: CurrentUserService
  ) {
    this.currentUser = this.loggedInUser.getUser();
  }

  logout() {
    localStorage.setItem('token', '');
    this.router.navigate(['/login']);
  }

  getRole(role: string): string {
    switch (role){
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'INSTRUCTOR':
        return 'Instructor';
      case 'STUDENT':
        return 'Student';
      default:
        return '';
    }
  }
}
