import { Component } from '@angular/core';
import {MatDialogActions, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-report-download-dialog',
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './report-download-dialog.component.html',
  styleUrl: './report-download-dialog.component.css'
})
export class ReportDownloadDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ReportDownloadDialogComponent>
  ) {
  }

  download(format: string): void {
    this.dialogRef.close(format);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
