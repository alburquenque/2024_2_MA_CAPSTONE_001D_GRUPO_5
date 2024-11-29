import { Component, OnInit } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.page.html',
  styleUrls: ['./edit-password.page.scss'],
})
export class EditPasswordPage implements OnInit {

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(private modalCtrl: ModalController,
              private authService: AuthService,
              private alertController: AlertController,
              private loadingController: LoadingController
  ) { }

  ngOnInit() {}

  name=String;
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async confirm() {
    const loading = await this.loadingController.create({
      message: 'Guardando cambios...',
    });
    await loading.present();
    if (this.newPassword !== this.confirmPassword) {
      console.log("1")
      await loading.dismiss();
      this.showAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    try{


    const isCurrentPasswordValid = await this.authService.verifyPassword(this.currentPassword);
    if (!isCurrentPasswordValid) {
      console.log("2")
      await loading.dismiss();
      this.showAlert('Error', 'La contraseña actual es incorrecta.');
      return;
    }

    const success = await this.authService.updatePassword(this.newPassword);
    if (success) {
      console.log("3")
      await loading.dismiss();
      this.showAlert('Éxito', 'La contraseña se ha actualizado correctamente.');
      return this.modalCtrl.dismiss(this.name, 'confirm');
    } else {
      console.log("4")
      await loading.dismiss();
      this.showAlert('Error', 'Hubo un problema actualizando la contraseña.');
      return
    }
  }
  catch(e){
    console.log("5")
    await loading.dismiss();
    this.showAlert('Error', 'Hubo un error inesperado vuelva a intentarlo más tarde');
    return
  }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  togglePasswordVisibility(field: string) {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

}
