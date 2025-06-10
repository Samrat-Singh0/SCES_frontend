import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveSemesterComponent } from './save-semester.component';

describe('SaveSemesterComponent', () => {
  let component: SaveSemesterComponent;
  let fixture: ComponentFixture<SaveSemesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveSemesterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveSemesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
