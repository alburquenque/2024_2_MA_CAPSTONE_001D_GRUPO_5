import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarProductosPageRoutingModule } from './listar-productos-routing.module';

import { ListarProductosPage } from './listar-productos.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarProductosPageRoutingModule,
    SharedModule
  ],
  declarations: [ListarProductosPage]
})
export class ListarProductosPageModule {}
