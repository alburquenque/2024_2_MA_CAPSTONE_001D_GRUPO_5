import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarProductosPage } from './listar-productos.page';

describe('ListarProductosPage', () => {
  let component: ListarProductosPage;
  let fixture: ComponentFixture<ListarProductosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
