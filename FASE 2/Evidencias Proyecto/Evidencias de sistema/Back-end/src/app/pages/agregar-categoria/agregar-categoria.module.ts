import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarCategoriaPageRoutingModule } from './agregar-categoria-routing.module';

import { AgregarCategoriaPage } from './agregar-categoria.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarCategoriaPageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [AgregarCategoriaPage]
})
export class AgregarCategoriaPageModule {}
