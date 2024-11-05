import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {
  userData: any;
  imageFile: File | null = null;

  profileData = {
    nombre: '',
    apellido: '',
    imagen: ''
  };

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.userData = this.authService.getLocalUserData();
    if (this.userData) {
      this.profileData.nombre = this.userData.nombre;
      this.profileData.apellido = this.userData.apellido;
      this.profileData.imagen = this.userData.imagen;
    }
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      try {
        this.imageFile = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.profileData.imagen = e.target.result;
        };
        reader.readAsDataURL(file);
      } catch (error) {
        this.showAlert('Error', 'Error al seleccionar la imagen.');
      }
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async confirmarCambios() {
    try {
      const hayCambios = 
        this.profileData.nombre !== this.userData.nombre ||
        this.profileData.apellido !== this.userData.apellido ||
        this.imageFile;

      if (hayCambios) {
        let imageUrl = this.userData.imagen;

        // Si hay una nueva imagen, subirla
        if (this.imageFile) {
          imageUrl = await this.authService.subirFotoPerfil(
            this.imageFile,
            this.userData.id_usuario
          );
        }

        await this.authService.actualizarPerfil({
          id_usuario: this.userData.id_usuario,
          nombre: this.profileData.nombre,
          apellido: this.profileData.apellido,
          imagen: imageUrl
        });

        const updatedUserData = {
          ...this.userData,
          nombre: this.profileData.nombre,
          apellido: this.profileData.apellido,
          imagen: imageUrl
        };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));

        await this.showAlert('Éxito', 'Datos de perfil modificados exitosamente.');
        return this.modalCtrl.dismiss(this.profileData, 'confirm');
      } else {
        await this.showAlert('Advertencia', 'No puede confirmar, no ha realizado ningún cambio.');
        return null
      }

    } catch (error) {
      await this.showAlert('Error', 'Error al actualizar perfil.');
      return this.modalCtrl.dismiss(null, 'error');
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
