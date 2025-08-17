import {Component, OnInit} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {UserService} from '../../services/user.service';
import {User} from '../../model/user.model';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MatMiniFabButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {SaveUserComponent} from '../save-user/save-user.component';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {SearchUser} from '../../model/search.model';
import {ConfirmationComponent} from '../../shared/confirmation/confirmation.component';
import {MatTooltip} from '@angular/material/tooltip';
import {JoinNameService} from '../../shared/join-name.service';
import {Role} from '../../enum/role.enum';
import {CurrentUserService} from '../../shared/current-user.service';
import {ToastrService} from 'ngx-toastr';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {RoleModel} from '../../model/role.model';
import {RoleService} from '../../services/role.service';
import {ActiveStatus} from '../../enum/active-status.enum';


@Component({
  selector: 'app-view-user',
  imports: [
    MatTableModule,
    MatIconModule,
    MatMiniFabButton,
    ReactiveFormsModule,
    NgIf,
    NgIf,
    NgForOf,
    MatTooltip,
    NgClass,
    FormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,

  ],
  templateUrl: './view-user.component.html',
  standalone: true,
  styleUrl: './view-user.component.css'
})

export class ViewUserComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['index', 'email', 'fullName', 'address', 'phoneNumber', 'role', 'status', 'edit']
  searchForm: FormGroup;
  totalPages: number = 0;
  currentPage: number = 0;
  isSearchEnabled: boolean = false;
  sizeSelect: number[] = [5,10,20,50,100]
  pageSize: number = this.sizeSelect[0];
  user: User;
  roles: RoleModel[];
  numberOfPages: number;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public joinName: JoinNameService,
    private currentUser: CurrentUserService,
    private roleService: RoleService
  ) {
    this.searchForm = new FormGroup({});
    this.user = this.currentUser.getUser();
    this.roles = [];
    this.numberOfPages = 3;
  }

  ngOnInit(): void {
    this.getRoles();
    this.buildSearchForm();
    this.renderContent(this.currentPage);
  }

  getRoles() {
    this.roleService.getSavedRoles().subscribe({
      next: res => {
        if(res.success) {
          this.roles = res.body;
        }else {
          this.toastr.error(res.message);
        }
      }, error: err => {
        this.toastr.error(err.message);
      }
    });
  }

  renderContent(page: number) {

    const searchCriteria: SearchUser = {
      firstName: this.searchForm.value.firstName?.trim() || null,
      middleName: this.searchForm.value.middleName?.trim() || null,
      lastName: this.searchForm.value.lastName?.trim() || null,
      role: this.searchForm.value.role?.trim() || null,
      phoneNumber: this.searchForm.value.phoneNumber?.trim() || null
    }


    this.userService.getAllUsers(searchCriteria, page,this.pageSize).subscribe({
      next: res => {
        if(res.success){
          this.users = res.body.content;
          this.totalPages = res.body.totalPages;
          this.currentPage = res.body.number;
        }else {
          this.toastr.error(res.message);
        }
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  buildSearchForm() {
    this.searchForm = this.fb.group({
      firstName: [undefined, Validators.pattern("^[a-zA-Z]*$")],
      middleName: [undefined, Validators.pattern("^[a-zA-Z]*$")],
      lastName: [undefined, Validators.pattern("^[a-zA-Z]*$")],
      role: [undefined],
      phoneNumber: [undefined, Validators.pattern("^(97|98)\\d{8}$")]
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
      this.renderContent(this.currentPage);
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
            if(res.success){
              this.renderContent(this.currentPage);
              this.toastr.success(res.message);
            }else {
              this.toastr.error(res.message);
            }
          },
          error: (err) => {
            this.toastr.error('');
          }
        })
      }
    })
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.renderContent(this.currentPage);
  }

  resetSearchForm() {
    this.searchForm.reset();
    this.isSearchEnabled = false;
    this.renderContent(this.currentPage);
  }

  getStatusStyle(status: ActiveStatus): string {
    switch (status) {
      case ActiveStatus.ACTIVE:
        return 'badge-active';
      case ActiveStatus.INACTIVE:
        return 'badge-inactive';
    }
  }

  getUserStatus(status: ActiveStatus): string {
    switch (status) {
      case ActiveStatus.ACTIVE:
        return 'Active';
      case ActiveStatus.INACTIVE:
        return 'Inactive';
    }
  }

  getUserRole(role: Role):string {
    switch (role) {
      case Role.SUPER_ADMIN:
        return 'Super Admin';
      case Role.INSTRUCTOR:
        return 'Instructor';
      case Role.STUDENT:
        return 'Student';
      default:
        return role;
    }
  }

  getRoleStyle(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'badge-admin';
      case 'STUDENT':
        return 'badge-student';
      case 'INSTRUCTOR':
        return 'badge-instructor';
      default:
        return 'badge-default';
    }
  }

  isLoggedInUser(user: User): boolean {
    return user.email === this.user.email;
  }

  isButtonVisible(i: number, currentPage: number): boolean {
    console.log(currentPage);
    if(currentPage === 0) {
      return i === currentPage || i === currentPage + 1 || i === currentPage + 2;
    }

    if(currentPage === this.totalPages-1) {
      return i === currentPage || i === currentPage - 1 || i === currentPage - 2;
    }
    return i === currentPage - 1 || i === currentPage + 1 || i === currentPage;

  }
}
