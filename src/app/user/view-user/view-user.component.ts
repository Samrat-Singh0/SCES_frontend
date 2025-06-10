import {Component, OnInit} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {UserService} from '../../services/user.service';
import {User} from '../../model/user.model';
import {NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';
import {MatMiniFabButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {SaveUserComponent} from '../save-user/save-user.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SearchUser} from '../../model/search-user.model';


@Component({
  selector: 'app-view-user',
  imports: [
    MatTableModule,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    MatIconModule,
    MatMiniFabButton,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.css'
})
export class ViewUserComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['index', 'email', 'fullName', 'address', 'phoneNumber', 'role', 'edit']
  searchForm: FormGroup;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
  ) {
    this.searchForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.renderContent();
  }

  renderContent() {
    this.userService.getAllUser().subscribe({
      next: data => {
          this.users = data.body;
          // this.snackbar.open(data.message, "Close", {duration: 3000})
      }, error: err => {
        this.snackbar.open(err.message, "Close", {duration: 3000} )
      }
    });
    this.buildSearchForm();
  }


  buildSearchForm() {
    this.searchForm = this.fb.group({
      fullName: [undefined, Validators.pattern("^[a-zA-Z]*$")],
      role: [undefined, Validators.pattern("^[a-zA-Z]*$")],
      phoneNumber: [undefined, Validators.pattern("^\\d+$")]
    })

  }

  openDialog(userData ?: any) {
    const dialogRef = this.dialog.open(SaveUserComponent, {
      width: '600px',
      maxHeight: '80vh',
      autoFocus: false,
      disableClose: false,
      panelClass: 'custom-dialog-container',
      data: userData || null      //user will be populatied when i call openDialog() along with arguments
    })

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    })
  }

  deleteUser(userCode: string, username: string) {
    this.userService.deleteUser(userCode).subscribe({
      next: (res) => {
        this.ngOnInit();
        this.snackbar.open(res.message, "Close", {duration: 3000});
      },
      error: (err) => {
        this.snackbar.open(err.message, "Close", {duration: 3000});
      }
    })
  }

  searchUser() {
    let fullName: string = this.searchForm.value.fullName || undefined;
    let role: string = this.searchForm.value.role || undefined;
    let phoneNumber: string = this.searchForm.value.phoneNumber || undefined;

    const searchCriteria: SearchUser = {
      fullName: fullName,
      role: role,
      phoneNumber: phoneNumber
    }

    this.userService.searchUser(searchCriteria).subscribe({
      next: (res) => {
        this.users = res.body;

      }, error: (err) => {
        console.log(err.message);
      }
    })

  }

  resetSearchForm() {
    this.searchForm.reset();
  }

}
