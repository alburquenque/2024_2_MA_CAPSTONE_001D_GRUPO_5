import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {
  userData: any;
  imageFile: File | null = null;
  private audio: HTMLAudioElement | undefined;

  profileData = {
    nombre: '',
    apellido: '',
    imagen: ''
  };

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private cdr : ChangeDetectorRef
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
    const loading = await this.loadingController.create({
      message: 'Guardando cambios...',
    });
    await loading.present();
    try {
      const hayCambios = 
        this.profileData.nombre !== this.userData.nombre ||
        this.profileData.apellido !== this.userData.apellido ||
        this.imageFile;

      if (hayCambios) {
        console.log("hubo cambios")
        let imageUrl = this.userData.imagen;


        //---- Easter Egg ---- 
        if (this.profileData.nombre === 'Vergil' && this.profileData.apellido === 'Sparda') {
          await this.easterEgg1()
        }

        if (this.profileData.nombre === 'Christian' && this.profileData.apellido === 'Lazcano') {
          await this.easterEgg2()
        }

        if (this.profileData.nombre === 'Alexis' && this.profileData.apellido === 'Sanchez') {
          await this.easterEgg3()
        }


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

        await loading.dismiss();
        await this.showAlert('Éxito', 'Datos de perfil modificados exitosamente. Puede tomar un momento para reflejarse en la aplicación.');
  
        this.ngOnInit()
        return this.modalCtrl.dismiss(this.profileData, 'confirm');
        
      } else {
        await loading.dismiss();
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



  playAudio(url: any) {
    this.audio = new Audio(url);
    this.audio.play().then(() => {
      console.log('Audio reproduciéndose...');
    }).catch(error => {
      console.error('Error al reproducir audio:', error);
    });
  }

  async easterEgg1(){
    this.playAudio('assets/BuryTheLight.mp3');
    const filePath = 'assets/Vergil.jpg';

    try {
      const response = await fetch(filePath);
      const blob = await response.blob();

      const fileName = 'Vergil.jpg';
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileData.imagen = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error cargando la imagen de Vergil:', error);
      await this.showAlert('Error', 'No se pudo cargar la imagen de Vergil.');
    }
  }

  async easterEgg2(){
    this.playAudio('assets/EasterEgg.mp3');
    const filePath = 'assets/Lazcano.png';

    try {
      const response = await fetch(filePath);
      const blob = await response.blob();

      const fileName = 'Lazcano.png';
      const file = new File([blob], fileName, { type: 'image/png' });

      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileData.imagen = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error cargando la imagen de Lazcano:', error);
      await this.showAlert('Error', 'No se pudo cargar la imagen de Lazcano.');
    }
  }

  async easterEgg3(){
    this.playAudio('assets/EasterEgg2.mp3');
    const filePath = 'assets/Alexis_Sanchez.jpg';

    try {
      const response = await fetch(filePath);
      const blob = await response.blob();

      const fileName = 'Alexis_Sanchez.jpg';
      const file = new File([blob], fileName, { type: 'image/jpg' });

      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileData.imagen = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error cargando la imagen de Alexis:', error);
      await this.showAlert('Error', 'No se pudo cargar la imagen de Alexis.');
    }
  }
}
