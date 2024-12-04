import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelarFacturaAbonadoComponent } from './cancelar-factura-abonado.component';

describe('CancelarFacturaAbonadoComponent', () => {
  let component: CancelarFacturaAbonadoComponent;
  let fixture: ComponentFixture<CancelarFacturaAbonadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancelarFacturaAbonadoComponent]
    });
    fixture = TestBed.createComponent(CancelarFacturaAbonadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
