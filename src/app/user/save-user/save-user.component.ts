import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {User} from '../../model/user.model';
import {UserService} from '../../services/user.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastrMsgService} from '../../shared/toastr-msg.service';
import {ConfirmationComponent} from '../../shared/confirmation/confirmation.component';

@Component({
  selector: 'app-add-user',
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatIconModule,
    FormsModule,
    NgClass,

  ],
  templateUrl: './save-user.component.html',
  standalone: true,
  styleUrl: './save-user.component.css'
})
export class SaveUserComponent implements OnInit {
  myForm: FormGroup;
  isEditMode = false;
  isFormForInstructor = false;
  fullName!: string;
  middleName!: string;
  lastName!: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<SaveUserComponent>,
    private toastr: ToastrMsgService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!this.data;
    if(this.data?.forSemester) {
      this.isFormForInstructor = true;
      this.isEditMode = false;
    }
    this.myForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.buildForm();
  }



  buildForm() {
    this.myForm = this.fb.group({
      userCode:[this.data?.userCode || ''],
      firstName: [this.data?.firstName || '',[
          Validators.required,
          Validators.minLength(3),
          Validators.pattern("^[A-Za-z]+$")
      ]],
      middleName:
        [this.data?.middleName || '',
        [Validators.pattern("^[A-Za-z]+$")]],
      lastName:
        [this.data?.lastName || '',
        [
          Validators.required, Validators.minLength(3),
          Validators.pattern("^[A-Za-z]+$")
        ]],
      email: [{value: this.data?.email || '', disabled: this.isEditMode}, [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
      address: [this.data?.address || '', [Validators.required, Validators.pattern("^[A-Za-z ]+$")]],
      phoneNumber: [this.data?.phoneNumber || '', [Validators.required, Validators.minLength(10),  Validators.maxLength(10), Validators.pattern("^(98\|97)\\d*$")]],
      role: [this.data?.role || 'SUPER_ADMIN']
    })
  }

  closeForm() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.myForm.valid) {

      const dialogRef = this.dialog.open(ConfirmationComponent, {
        width: '600px',
        maxWidth: 'none',
        disableClose: true,
        data: {
          title: 'Confirm Add User',
          message: 'Are you sure you want to add this new user? Please verify all the details before proceeding.',
          requireRemarks: false
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result?.confirmed){
          const form = this.myForm.getRawValue();
          const user: User = {
            code: this.data?.code || '',
            email: form.email,
            firstName: form.firstName,
            middleName: form.middleName,
            lastName: form.lastName,
            address: form.address,
            phoneNumber: form.phoneNumber,
            role: form.role
          }

          if(this.isEditMode){
            this.userService.updateUser(user).subscribe({
              next: (res) => {
                this.toastr.success(res.message)
                this.dialogRef.close();
              }, error: (err)=> {
                // console.log(err);
                this.toastr.error('')
              }
            })
          }else {
            this.userService.addUser(user).subscribe({
              next: res => {
                this.toastr.success(res.message);
                if(this.isFormForInstructor) {
                  this.dialogRef.close({
                    user: user
                  });
                }else{
                  this.dialogRef.close();
                }
              }, error: (err) =>{
                this.toastr.error('');
              }
            });
          }
        }
      })


    }
  }

  resetForm() {
    this.buildForm();
  }


}
