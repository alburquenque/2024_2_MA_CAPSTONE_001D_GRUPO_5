import { AuthService } from './../../services/auth.service'
import { Component } from '@angular/core'
import { FormBuilder, Validators, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { LoadingController, AlertController } from '@ionic/angular'


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  
  credentials:FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {


    this.credentials = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.router.navigateByUrl('/groups', { replaceUrl: true })
      }
    })
  }

  get email() {
    return this.credentials.get('email')?.value;
  }

  get password() {
    return this.credentials.get('password')?.value;
  }

  async login() {
    const loading = await this.loadingController.create()
    await loading.present()

    this.authService.signIn(this.credentials.getRawValue()).then(async (data) => {
      await loading.dismiss()
      if (data.error) {
        this.showAlert('Inicio de sesión fallido', data.error.message) 
      }
      else {
        this.router.navigateByUrl('/home', { replaceUrl: true })
      }
    })
  }

  async showAlert(title:string, msg:any) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    })
    await alert.present()
  }

  
}
