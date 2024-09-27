import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleCarritosPage } from './detalle-carritos.page';

describe('DetalleCarritosPage', () => {
  let component: DetalleCarritosPage;
  let fixture: ComponentFixture<DetalleCarritosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCarritosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
