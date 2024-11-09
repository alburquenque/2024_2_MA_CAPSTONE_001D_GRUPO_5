import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScannerPageRoutingModule } from './scanner-routing.module';

import { ScannerPage } from './scanner.page';

import { SharedModule } from 'src/app/shared/shared.module';

import { FormatoDineroPipe } from 'src/app/pipes/formato-dinero.pipe';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScannerPageRoutingModule,
    SharedModule,
    FormatoDineroPipe


  ],
  declarations: [ScannerPage]
})
export class ScannerPageModule {}
