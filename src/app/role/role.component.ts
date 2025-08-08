import {Component, OnInit} from '@angular/core';
import {RoleService} from '../services/role.service';
import {ToastrMsgService} from '../shared/toastr-msg.service';
import {RoleModel} from '../model/role.model';
import {NgForOf} from '@angular/common';
import {RolePermission} from '../model/role-permission.model';
import {MatIcon} from '@angular/material/icon';
import {MatCheckbox} from '@angular/material/checkbox';
import {Permission} from '../model/permission.model';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationComponent} from '../shared/confirmation/confirmation.component';
import {AddRoleComponent} from './add-role/add-role.component';

@Component({
  selector: 'app-role',
  imports: [
    NgForOf,
    MatIcon,
    MatCheckbox,
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent implements OnInit {

  rolePermission:RolePermission | null;
  updatedPermissions: Map<String, String[]>;

  constructor(
    private roleService: RoleService,
    private toastr: ToastrMsgService,
    private dialogRef: MatDialog,
  ) {
    this.rolePermission = null;
    this.updatedPermissions  = new Map<String, String[]>();
  }

  ngOnInit(): void {
    this.populateData();
  }

  populateData() {
    this.roleService.getAllRoles().subscribe({
      next: res => {
        if(res.success) {
          this.rolePermission = res.body;
          this.loadOldPermissions();
        }else{
          this.toastr.error(res.message);
        }
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  loadOldPermissions() {
    for(let role of this.rolePermission?.roles!) {
      let permCodes = role.permissions.map(perm => perm.code);
      this.updatedPermissions.set(role.code, permCodes || []);
    }
  }

  onCheck(role: RoleModel, permission: Permission) {

    if(this.updatedPermissions.has(role.code)) {
      if(this.updatedPermissions.get(role.code)?.includes(permission.code)){
        const index = this.updatedPermissions.get(role.code)?.indexOf(permission.code);
        this.updatedPermissions.get(role.code)?.splice(index!, 1);
      }else {
        this.updatedPermissions.get(role.code)?.push(permission.code);
      }
    }else {
      this.updatedPermissions.set(role.code, [permission.code]);
    }
  }

  save() {
    const dialog = this.dialogRef.open(ConfirmationComponent, {
      data: {
        title: 'Confirm Permission',
        message: 'Are you sure you want to save these permissions?',
        requireRemarks: false
      }
    })

    dialog.afterClosed().subscribe(result =>{
      if(result.confirmed) {
        this.roleService.saveRolesWithPermissions(this.updatedPermissions).subscribe({
          next: res => {
            if(res?.success) {
              this.toastr.success(res.message);
            }else {
              this.toastr.error(res.message);
            }
          }, error: err => {
            this.toastr.error('');
          }
        });
      }
    });

  }

  reset() {
    this.populateData();

  }

  isCheckboxChecked(role: RoleModel, permission: Permission): boolean {
    for(let data of this.rolePermission?.roles!) {
      if(data.code === role.code) {
        for(let perm of data.permissions) {
          if(perm.code === permission.code){
            return true;
          }
        }
      }
    }

    return false;
  }

  addRole() {

    const dialog = this.dialogRef.open(AddRoleComponent, {
      width: '350px',
      height: '500px'
    });
    dialog.afterClosed().subscribe(res => {
      this.populateData();
    });
  }
}
