import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGradeInstructorComponent } from './view-grade-instructor.component';

describe('ViewGradeInstructorComponent', () => {
  let component: ViewGradeInstructorComponent;
  let fixture: ComponentFixture<ViewGradeInstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewGradeInstructorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewGradeInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
