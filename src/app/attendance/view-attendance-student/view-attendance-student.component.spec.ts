import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAttendanceStudentComponent } from './view-attendance-student.component';

describe('ViewAttendanceStudentComponent', () => {
  let component: ViewAttendanceStudentComponent;
  let fixture: ComponentFixture<ViewAttendanceStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAttendanceStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAttendanceStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
