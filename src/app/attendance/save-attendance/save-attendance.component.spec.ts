import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveAttendanceComponent } from './save-attendance.component';

describe('SaveAttendanceComponent', () => {
  let component: SaveAttendanceComponent;
  let fixture: ComponentFixture<SaveAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
