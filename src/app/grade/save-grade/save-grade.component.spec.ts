import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveGradeComponent } from './save-grade.component';

describe('SaveGradeComponent', () => {
  let component: SaveGradeComponent;
  let fixture: ComponentFixture<SaveGradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveGradeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
