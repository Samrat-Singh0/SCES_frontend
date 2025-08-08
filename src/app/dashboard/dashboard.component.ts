import {Component, OnInit} from '@angular/core';
import {Role} from '../enum/role.enum';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {Permission} from '../model/permission.model';
import {JoinNameService} from '../shared/join-name.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  currentUser: any;
  dashboardItems: Permission[];

  constructor(
    protected joinName: JoinNameService,
    private router: Router
  ) {
    this.currentUser = JSON.parse(localStorage.getItem("loggedInUser")!);
    this.dashboardItems = this.currentUser.role.permissions;
  }

  ngOnInit(): void {

  }

  logout() {
    localStorage.setItem('accessToken', '');
    localStorage.setItem('refreshToken', '');
    localStorage.setItem('loggedInUser','');
    this.router.navigate(['/login']);
  }

  getIconClass(item: Permission): string {
    return 'bi ' + item.iconName + ' sidebar-icon';
  }

  protected readonly Role = Role;
}
