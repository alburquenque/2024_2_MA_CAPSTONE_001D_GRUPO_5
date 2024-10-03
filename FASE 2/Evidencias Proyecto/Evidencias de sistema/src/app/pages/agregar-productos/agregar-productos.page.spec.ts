import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarProductosPage } from './agregar-productos.page';

describe('AgregarProductosPage', () => {
  let component: AgregarProductosPage;
  let fixture: ComponentFixture<AgregarProductosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
