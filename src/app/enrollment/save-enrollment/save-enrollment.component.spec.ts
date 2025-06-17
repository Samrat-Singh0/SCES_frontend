import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveEnrollmentComponent } from './save-enrollment.component';

describe('SaveEnrollmentComponent', () => {
  let component: SaveEnrollmentComponent;
  let fixture: ComponentFixture<SaveEnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveEnrollmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
