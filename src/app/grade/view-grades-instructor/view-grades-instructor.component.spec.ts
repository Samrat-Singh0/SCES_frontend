import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGradesInstructorComponent } from './view-grades-instructor.component';

describe('ViewGradesInstructorComponent', () => {
  let component: ViewGradesInstructorComponent;
  let fixture: ComponentFixture<ViewGradesInstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewGradesInstructorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewGradesInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
