import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarProductosPageRoutingModule } from './agregar-productos-routing.module';

import { AgregarProductosPage } from './agregar-productos.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarProductosPageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [AgregarProductosPage]
})
export class AgregarProductosPageModule {}
