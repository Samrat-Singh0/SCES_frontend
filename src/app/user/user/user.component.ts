import { Component } from '@angular/core';
import {AddUserComponent} from '../add-user/add-user/add-user.component';

@Component({
  selector: 'app-user',
  imports: [
    AddUserComponent
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

}
