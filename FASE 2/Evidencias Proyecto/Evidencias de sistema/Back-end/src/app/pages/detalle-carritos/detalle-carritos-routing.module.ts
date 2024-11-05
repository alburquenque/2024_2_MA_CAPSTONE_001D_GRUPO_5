import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleCarritosPage } from './detalle-carritos.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleCarritosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleCarritosPageRoutingModule {}
