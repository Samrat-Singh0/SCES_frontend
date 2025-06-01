import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {UserComponent} from '../../../user/user/user.component';

@Component({
  selector: 'app-super-admin-dashboard',
  imports: [
    RouterOutlet,
    RouterLink,
    UserComponent
  ],
  templateUrl: './super-admin-dashboard.component.html',
  styleUrl: './super-admin-dashboard.component.css'
})
export class SuperAdminDashboardComponent {

}
