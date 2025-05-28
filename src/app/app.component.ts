import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AddUserComponent} from './user/add-user/add-user/add-user.component';

@Component({
  selector: 'app-root',
  imports: [ FormsModule, AddUserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sces_frontend';
}
