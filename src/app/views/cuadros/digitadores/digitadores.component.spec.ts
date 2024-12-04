import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitadoresComponent } from './digitadores.component';

describe('DigitadoresComponent', () => {
  let component: DigitadoresComponent;
  let fixture: ComponentFixture<DigitadoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DigitadoresComponent]
    });
    fixture = TestBed.createComponent(DigitadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
