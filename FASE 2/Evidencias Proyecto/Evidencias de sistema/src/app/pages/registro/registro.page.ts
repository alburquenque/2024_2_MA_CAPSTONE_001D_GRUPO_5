import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {

  registroForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private formBuilder: FormBuilder
  ) {
    this.registroForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', Validators.required]
    }, { validator: this.coincidenciaPassword });
  }

  coincidenciaPassword(group: FormGroup) {
    const password = group.get('password')?.value;
    const password2 = group.get('password2')?.value;
    return password === password2 ? null : { diferentes: true };
  }

  async registrarse() {
    if (this.registroForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Registrando usuario, por favor espere...',
      });
      await loading.present();

      try {
        const { email, password, nombre, apellido } = this.registroForm.value;
        const resultado = await this.authService.register(email, password, nombre, apellido);
        await loading.dismiss();
        
        const toast = await this.toastController.create({
          message: 'Usuario registrado exitosamente',
          duration: 2000,
          color: 'secondary'
        });
        toast.present();

        this.router.navigate(['/login']);
      } catch (error) {
        await loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error en el registro: ' + (error as Error).message,
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    } else {
      const toast = await this.toastController.create({
        message: 'Por favor, complete todos los campos correctamente',
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    }
  }
}