import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {JoinNameService} from '../../../shared/join-name.service';
import {CurrentUserService} from '../../../shared/current-user.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  protected readonly currentUser: any;

  constructor(
    private loggedInUser: CurrentUserService,
    public joinName: JoinNameService,
    private router: Router
  ) {
    this.currentUser = this.loggedInUser.getUser();
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

  logout() {
    localStorage.setItem('token', '');
    localStorage.setItem('role','');
    localStorage.setItem('loggedInUser','');
    this.router.navigate(['/login']);
  }
}
