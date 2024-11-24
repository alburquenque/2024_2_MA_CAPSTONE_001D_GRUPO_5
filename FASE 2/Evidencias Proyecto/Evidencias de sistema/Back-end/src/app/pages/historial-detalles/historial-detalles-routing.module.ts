import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialDetallesPage } from './historial-detalles.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialDetallesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialDetallesPageRoutingModule {}
