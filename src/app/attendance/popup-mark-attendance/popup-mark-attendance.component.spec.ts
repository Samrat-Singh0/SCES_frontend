import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupMarkAttendanceComponent } from './popup-mark-attendance.component';

describe('PopupMarkAttendanceComponent', () => {
  let component: PopupMarkAttendanceComponent;
  let fixture: ComponentFixture<PopupMarkAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupMarkAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupMarkAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
