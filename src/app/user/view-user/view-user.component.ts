import {Component, OnInit} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {UserService} from '../../services/user.service';
import {User} from '../../model/user.model';
import {NgForOf, NgIf} from '@angular/common';
import {MatMiniFabButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {SaveUserComponent} from '../save-user/save-user.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SearchUser} from '../../model/search.model';
import {ConfirmationComponent} from '../../shared/confirmation/confirmation.component';


@Component({
  selector: 'app-view-user',
  imports: [
    MatTableModule,
    MatIconModule,
    MatMiniFabButton,
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.css'
})
export class ViewUserComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['index', 'email', 'fullName', 'address', 'phoneNumber', 'role', 'edit']
  searchForm: FormGroup;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 5;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
  ) {
    this.searchForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.renderContent(this.currentPage);
  }

  renderContent(page: number) {
    this.userService.getPagedUsers(page,this.pageSize).subscribe({
      next: data => {
          this.users = data.body.content;
          this.totalPages = data.body.totalPages;
          this.currentPage = data.body.number;
          // this.snackbar.open(data.message, "Close", {duration: 3000})
      }, error: err => {
        this.snackbar.open(err.message, "Close", {duration: 3000} )
      }
    });
    this.buildSearchForm();
  }

  buildSearchForm() {
    this.searchForm = this.fb.group({
      firstName: [undefined, Validators.pattern("^[a-zA-Z]*$")],
      middleName: [undefined, Validators.pattern("^[a-zA-Z]*$")],
      lastName: [undefined, Validators.pattern("^[a-zA-Z]*$")],
      role: [undefined, Validators.pattern("^[a-zA-Z]*$")],
      phoneNumber: [undefined, Validators.pattern("^\\d+$")]
    })

  }

  goToPage(page: number): void {
    if(page >= 0 && page < this.totalPages){
      this.renderContent(page);
    }
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

  deleteUser(user: User) {
    this.openConfirmDialog(user)
  }

  openConfirmDialog(user: User): void {
    const dialogRef= this.dialog.open(ConfirmationComponent, {
      width: '600px',
      maxWidth: 'none',
      disableClose: true,
      data: {
        title: 'Delete User',
        message: 'Are you sure you want to delete the user?',
        requireRemarks: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result?.confirmed){
        this.userService.deleteUser(user.code, result?.remarks).subscribe({
          next: (res) => {
            this.ngOnInit();
            this.snackbar.open(res.message, "Close", {duration: 3000});
          },
          error: (err) => {
            this.snackbar.open(err.message, "Close", {duration: 3000});
          }
        })
      }
    })
  }

  searchUser() {
    const formValue = this.searchForm.value;

    const searchCriteria: SearchUser = {
      firstName: formValue.firstName?.trim() || undefined,
      middleName: formValue.middleName?.trim() || undefined,
      lastName: formValue.lastName?.trim() || undefined,
      role: formValue.role?.trim() || undefined,
      phoneNumber: formValue.phoneNumber?.trim() || undefined
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
    this.renderContent(this.currentPage)
  }

  getFullName(firstName: string, lastName: string, middleName?: string): string {
    return [firstName, middleName, lastName].filter(Boolean).join(' ');
  }


}
