import {Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common';
import {Role} from '../../../enum/role.enum';
import {SpinnerComponent} from '../../../shared/spinner/spinner.component';
import {CurrentUserService} from '../../../shared/current-user.service';
import {JoinNameService} from '../../../shared/join-name.service';

@Component({
  selector: 'app-super-admin-dashboard',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgIf,
    SpinnerComponent,
  ],
  templateUrl: './super-admin-dashboard.component.html',
  styleUrl: './super-admin-dashboard.component.css'
})
export class SuperAdminDashboardComponent {

  protected currentUser: any;

  constructor(
    private router: Router,
    private loggedInUser: CurrentUserService,
    public joinName: JoinNameService
  ) {
    this.currentUser = this.loggedInUser.getUser();
  }

  logout() {
    localStorage.setItem('token', '');
    localStorage.setItem('role','');
    localStorage.setItem('loggedInUser','');
    this.loggedInUser.setUserNull();
    this.router.navigate(['/login']);
  }


  isSuperAdmin(): boolean {
    return this.currentUser.role === Role.SUPER_ADMIN;
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
