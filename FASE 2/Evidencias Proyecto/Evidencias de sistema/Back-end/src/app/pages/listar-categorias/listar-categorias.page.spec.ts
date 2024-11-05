import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarCategoriasPage } from './listar-categorias.page';

describe('ListarCategoriasPage', () => {
  let component: ListarCategoriasPage;
  let fixture: ComponentFixture<ListarCategoriasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarCategoriasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
