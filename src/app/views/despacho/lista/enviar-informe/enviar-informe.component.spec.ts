import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarInformeComponent } from './enviar-informe.component';

describe('EnviarInformeComponent', () => {
  let component: EnviarInformeComponent;
  let fixture: ComponentFixture<EnviarInformeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnviarInformeComponent]
    });
    fixture = TestBed.createComponent(EnviarInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
