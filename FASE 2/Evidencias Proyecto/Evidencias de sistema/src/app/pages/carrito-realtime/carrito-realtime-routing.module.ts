import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarritoRealtimePage } from './carrito-realtime.page';

const routes: Routes = [
  {
    path: '',
    component: CarritoRealtimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarritoRealtimePageRoutingModule {}
