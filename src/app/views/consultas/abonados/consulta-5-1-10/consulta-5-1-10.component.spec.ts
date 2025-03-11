import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Consulta5110Component } from './consulta-5-1-10.component';

describe('Consulta5110Component', () => {
  let component: Consulta5110Component;
  let fixture: ComponentFixture<Consulta5110Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Consulta5110Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Consulta5110Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
