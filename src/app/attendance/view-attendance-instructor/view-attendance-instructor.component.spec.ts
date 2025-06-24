import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAttendanceInstructorComponent } from './view-attendance-instructor.component';

describe('ViewAttendanceInstructorComponent', () => {
  let component: ViewAttendanceInstructorComponent;
  let fixture: ComponentFixture<ViewAttendanceInstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAttendanceInstructorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAttendanceInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
