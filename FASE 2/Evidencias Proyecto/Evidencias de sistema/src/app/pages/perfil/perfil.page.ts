import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EditPasswordComponent } from 'src/app/components/edit-password/edit-password.component';
import { AuthService } from 'src/app/services/auth.service';
import { AuthSession, User } from '@supabase/supabase-js';
import { EditarPerfilPage } from '../editar-perfil/editar-perfil.page';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  user: User | null = null;
  nombre: string = '';
  apellido: string = ''; 
  localUserData: any; 
  
  constructor(private modalCtrl: ModalController, private authService: AuthService) {}

 ngOnInit() {
  this.localUserData = this.authService.getLocalUserData();
}

  message = 'This modal example uses the modalController to present and dismiss modals.';



  async openModal() {
    const modal = await this.modalCtrl.create({
      component: EditarPerfilPage,
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
