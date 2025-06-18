import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {NgIf} from '@angular/common';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-confirmation',
  imports: [
    MatDialogContent,
    MatFormField,
    MatDialogTitle,
    NgIf,
    MatInput,
    FormsModule,
    MatDialogActions,
    MatButton,
    MatLabel,
  ],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent {
  title?: string;
  message?: string;
  remarks: string = '';

  constructor(
    private dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title?: string;
      message?: string;
      requireRemarks?: boolean;
    }
  ) {
  }

  onCancel() {
    this.dialogRef.close({confirmed: false});
  }

  onConfirm() {
    this.dialogRef.close({
      confirmed: true,
      remarks: this.data.requireRemarks ? this.remarks :null
    });
  }
}
