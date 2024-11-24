import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialDetallesPageRoutingModule } from './historial-detalles-routing.module';

import { HistorialDetallesPage } from './historial-detalles.page';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialDetallesPageRoutingModule,
    SharedModule
  ],
  declarations: [HistorialDetallesPage]
})
export class HistorialDetallesPageModule {}
