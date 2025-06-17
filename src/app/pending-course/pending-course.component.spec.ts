import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingCourseComponent } from './pending-course.component';

describe('PendingCourseComponent', () => {
  let component: PendingCourseComponent;
  let fixture: ComponentFixture<PendingCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
