import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScannerQrPageRoutingModule } from './scanner-qr-routing.module';

import { ScannerQrPage } from './scanner-qr.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScannerQrPageRoutingModule,
    SharedModule,
  ],
  declarations: [ScannerQrPage]
})
export class ScannerQrPageModule {}
