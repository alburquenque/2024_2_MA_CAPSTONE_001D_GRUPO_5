import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeSuperadminPageRoutingModule } from './home-superadmin-routing.module';

import { HomeSuperadminPage } from './home-superadmin.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeSuperadminPageRoutingModule,
    SharedModule
  ],
  declarations: [HomeSuperadminPage]
})
export class HomeSuperadminPageModule {}
