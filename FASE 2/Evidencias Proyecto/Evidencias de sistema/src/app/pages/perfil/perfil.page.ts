import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EditProfileComponent } from 'src/app/components/edit-profile/edit-profile.component';
import { EditPasswordComponent } from 'src/app/components/edit-password/edit-password.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
  }

  message = 'This modal example uses the modalController to present and dismiss modals.';



  async openModal() {
    const modal = await this.modalCtrl.create({
      component: EditProfileComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.message = `Hello, ${data}!`;
    }
  }

  async openModal2() {
    const modal = await this.modalCtrl.create({
      component: EditPasswordComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.message = `Hello, ${data}!`;
    }
  }



}
