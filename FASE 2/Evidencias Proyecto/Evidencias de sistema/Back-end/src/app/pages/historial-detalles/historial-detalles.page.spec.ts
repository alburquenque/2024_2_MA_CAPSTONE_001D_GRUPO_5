import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialDetallesPage } from './historial-detalles.page';

describe('HistorialDetallesPage', () => {
  let component: HistorialDetallesPage;
  let fixture: ComponentFixture<HistorialDetallesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialDetallesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
