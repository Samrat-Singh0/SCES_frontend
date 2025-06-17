import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveCourseComponent } from './save-course.component';

describe('SaveCourseComponent', () => {
  let component: SaveCourseComponent;
  let fixture: ComponentFixture<SaveCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
