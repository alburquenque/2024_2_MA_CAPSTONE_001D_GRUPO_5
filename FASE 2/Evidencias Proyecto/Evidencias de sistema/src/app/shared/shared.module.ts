import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../components/header/header.component';
import { AvatarPopoverComponent } from '../components/avatar-popover/avatar-popover.component';
import { EditProfileComponent } from '../components/edit-profile/edit-profile.component';
@NgModule({
  declarations: [HeaderComponent, AvatarPopoverComponent, EditProfileComponent],
  imports: [CommonModule, IonicModule],
  exports: [HeaderComponent]
})
export class SharedModule { }