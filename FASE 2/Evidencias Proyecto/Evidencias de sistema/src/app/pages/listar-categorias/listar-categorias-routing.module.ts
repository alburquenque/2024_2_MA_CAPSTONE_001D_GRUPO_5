import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarCategoriasPage } from './listar-categorias.page';

const routes: Routes = [
  {
    path: '',
    component: ListarCategoriasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarCategoriasPageRoutingModule {}
