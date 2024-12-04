import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraductorasComponent } from './traductoras.component';

describe('TraductorasComponent', () => {
  let component: TraductorasComponent;
  let fixture: ComponentFixture<TraductorasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TraductorasComponent]
    });
    fixture = TestBed.createComponent(TraductorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
