import {Component} from '@angular/core';
import {MatDialogActions, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-report-download-dialog',
  imports: [
    MatDialogActions,
    MatButton
  ],
  templateUrl: './report-download-dialog.component.html',
  standalone: true,
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
    this.dialogRef.close('cancel');
  }
}
