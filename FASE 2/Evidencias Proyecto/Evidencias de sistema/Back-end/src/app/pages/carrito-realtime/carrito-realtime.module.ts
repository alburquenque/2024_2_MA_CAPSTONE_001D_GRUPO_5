import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarritoRealtimePageRoutingModule } from './carrito-realtime-routing.module';

import { CarritoRealtimePage } from './carrito-realtime.page';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarritoRealtimePageRoutingModule,
    SharedModule
  ],
  declarations: [CarritoRealtimePage]
})
export class CarritoRealtimePageModule {}
