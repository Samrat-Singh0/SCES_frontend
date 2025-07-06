import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDownloadDialogComponent } from './report-download-dialog.component';

describe('ReportDownloadDialogComponent', () => {
  let component: ReportDownloadDialogComponent;
  let fixture: ComponentFixture<ReportDownloadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDownloadDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportDownloadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
