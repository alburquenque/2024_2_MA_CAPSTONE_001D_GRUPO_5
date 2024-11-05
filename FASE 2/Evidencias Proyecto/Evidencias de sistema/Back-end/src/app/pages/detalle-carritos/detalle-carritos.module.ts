import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleCarritosPageRoutingModule } from './detalle-carritos-routing.module';

import { DetalleCarritosPage } from './detalle-carritos.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleCarritosPageRoutingModule,
    SharedModule
  ],
  declarations: [DetalleCarritosPage]
})
export class DetalleCarritosPageModule {}
