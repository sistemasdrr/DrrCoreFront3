import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Consulta5111Component } from './consulta-5-1-11.component';

describe('Consulta5111Component', () => {
  let component: Consulta5111Component;
  let fixture: ComponentFixture<Consulta5111Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Consulta5111Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Consulta5111Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
