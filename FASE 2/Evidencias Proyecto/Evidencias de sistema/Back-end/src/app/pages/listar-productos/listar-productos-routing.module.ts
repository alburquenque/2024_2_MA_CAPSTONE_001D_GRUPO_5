import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarProductosPage } from './listar-productos.page';

const routes: Routes = [
  {
    path: '',
    component: ListarProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarProductosPageRoutingModule {}
