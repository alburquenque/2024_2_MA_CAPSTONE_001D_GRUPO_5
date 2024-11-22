import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmacionPagoPageRoutingModule } from './confirmacion-pago-routing.module';

import { ConfirmacionPagoPage } from './confirmacion-pago.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ConfirmacionPagoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmacionPagoPageRoutingModule,
    SharedModule,
    RouterModule
  ],
  declarations: [ConfirmacionPagoPage],
  exports: [RouterModule]
})
export class ConfirmacionPagoPageModule {}
