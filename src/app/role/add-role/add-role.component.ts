import {Component, OnInit} from '@angular/core';
import {MatFormField, MatOption, MatSelect} from '@angular/material/select';
import {Role} from '../../enum/role.enum';
import {MatIcon} from '@angular/material/icon';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RoleService} from '../../services/role.service';
import {RoleModel} from '../../model/role.model';
import {ToastrMsgService} from '../../shared/toastr-msg.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NgIf} from '@angular/common';
import {ConfirmationComponent} from '../../shared/confirmation/confirmation.component';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-add-role',
  imports: [
    MatSelect,
    MatOption,
    MatFormField,
    MatIcon,
    ReactiveFormsModule,
    NgIf,
    MatIconButton
  ],
  templateUrl: './add-role.component.html',
  styleUrl: './add-role.component.css'
})
export class AddRoleComponent implements OnInit{

  protected roles: string[] = [];
  roleForm: FormGroup;

  constructor(
    private builder: FormBuilder,
    private roleService: RoleService,
    private toastr: ToastrMsgService,
    protected dialogRef: MatDialogRef<AddRoleComponent>,
    private confirmDialog: MatDialog
  ) {
    this.roleForm = new FormGroup({});
  }

  ngOnInit() {
    this.getRoles();
    this.buildForm();
  }

  getRoles() {
    for(let role in Role){
      if(!isNaN(Number(role))){
        continue;
      }
      this.roles.push(role);
    }
    this.getSavedRoles();
  }

  getSavedRoles() {
    this.roleService.getAllRoles().subscribe({
      next: res => {
        if(res.success) {
          for(let role of res.body.roles) {
            if(this.roles.includes(role.roleType)){
              let index = this.roles.indexOf(role.roleType);
              this.roles.splice(index, 1);
            }
          }
        }else {
          this.toastr.error(res.message);
        }
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  buildForm() {
    this.roleForm = this.builder.group({
      name: ['', [Validators.required, Validators.pattern("^[a-zA-Z\\s]+$")]],
      type: ['', Validators.required]
    })
  }

  save() {
    const newRole: RoleModel = {
      code: '',
      roleName: this.roleForm.get('name')?.value,
      roleType: this.roleForm.get('type')?.value,
      permissions: []
    }

    console.log(newRole);

    if(this.roleForm.valid) {
      const dialog = this.confirmDialog.open(ConfirmationComponent, {
        data: {
          title: 'Confirm Add',
          message:"Are you sure you want to add a new role?",
          requireRemarks: false
        }
      });

      dialog.afterClosed().subscribe(res => {
        if(res?.confirmed){
          this.roleService.addNewRole(newRole).subscribe({
            next: res => {
              if(res.success) {
                this.toastr.success(res.message);
                this.dialogRef.close();
              }else {
                this.toastr.error(res.message);
              }
            }, error: err => {
              this.toastr.error('');
            }
          });
        }
      });
    }else {
      this.toastr.error("Valid data required.")
    }
  }
}
