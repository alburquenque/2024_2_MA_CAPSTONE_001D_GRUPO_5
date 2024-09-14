import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../components/header/header.component';
import { AvatarPopoverComponent } from '../components/avatar-popover/avatar-popover.component';
@NgModule({
  declarations: [HeaderComponent, AvatarPopoverComponent],
  imports: [CommonModule, IonicModule],
  exports: [HeaderComponent]
})
export class SharedModule { }