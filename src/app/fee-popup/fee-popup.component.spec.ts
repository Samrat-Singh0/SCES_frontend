import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeePopupComponent } from './fee-popup.component';

describe('FeePopupComponent', () => {
  let component: FeePopupComponent;
  let fixture: ComponentFixture<FeePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
