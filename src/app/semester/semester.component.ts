import {Component, OnInit} from '@angular/core';
import {Semester} from '../model/semester.model';
import {SemesterService} from '../services/semester.service';
import {NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatMiniFabButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {SemesterStateService} from '../shared/semester-state.service';
import {MatTooltip} from '@angular/material/tooltip';
import {ToastrMsgService} from '../shared/toastr-msg.service';
import {ActiveStatus} from '../enum/active-status.enum';
import {ReportRequest} from '../model/report-request.model';
import {
  ReportDownloadDialogComponent
} from '../report-download-dialog/report-download-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ReportService} from '../services/report.service';
import {GenerateDownloadLinkService} from '../shared/generate-download-link.service';

@Component({
  selector: 'app-semester',
  imports: [
    NgForOf,
    MatIcon,
    FormsModule,
    MatMiniFabButton,
    MatTooltip,
    NgIf
  ],
  templateUrl: './semester.component.html',
  standalone: true,
  styleUrl: './semester.component.css'
})
export class SemesterComponent implements OnInit{

  semesters: Semester[] = [];

  constructor(
    private semesterService: SemesterService,
    private toastr: ToastrMsgService,
    private router: Router,
    private semesterState: SemesterStateService,
    private dialog: MatDialog,
    private reportService: ReportService,
    private generateDownloadLinkService: GenerateDownloadLinkService,
    ) {
  }

  ngOnInit() {
    this.loadSemesters();
  }

  loadSemesters() {
    this.semesterService.getAll(ActiveStatus.ACTIVE).subscribe({
      next: (res) => {
        if(res.success){
          this.semesters = res.body;
        }else {
          this.toastr.error(res.message);
        }
      }, error: (err) => {
          this.toastr.error('');
      }
    });
  }

  addSemester() {
    if(this.semesters.length >= 8){
      this.toastr.error('Cannot add more than 8 semesters.')
    }else{
      this.router.navigate(['super/semester/add']);
    }
  }


  updateSemester(semester: Semester) {
    this.semesterState.setSemester(semester);
    this.router.navigate(['super/semester/edit/']);
  }

  downloadReport(documentType: string) {
    const reportDto: ReportRequest = {
      documentType: documentType || null,
      courseCode: null,
    }
      const dialogRef = this.dialog.open(ReportDownloadDialogComponent, {
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(format => {
        if(format) {
          reportDto.documentType = format
          if(format !== 'cancel'){
            this.sendDownloadRequest(reportDto);
          }
        }
      });
  }

  sendDownloadRequest(reportDto: ReportRequest) {
    this.reportService.downloadSemesterReport(reportDto).subscribe({
      next: value => {
        if(value.status < 200 || value.status >=300) {
          this.toastr.error('');
          return;
        }
        const file = value.body!;
        let fileName: string = '';
        if(reportDto.documentType === 'PDF'){
          fileName = 'semester-report.pdf';
        }else {
          fileName ='grade-report.xlsx';
        }
        this.generateDownloadLinkService.generateLink(file, fileName);
        this.toastr.success("Download Complete");
      }, error: err => {
        this.toastr.error('');
      }
    });
  }
}
