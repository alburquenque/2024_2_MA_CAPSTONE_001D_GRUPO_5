  import { AuthService } from './../../services/auth.service'
  import { Component, OnInit } from '@angular/core'
  import { FormBuilder, Validators, FormGroup } from '@angular/forms'
  import { Router } from '@angular/router'
  import { LoadingController, AlertController } from '@ionic/angular'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  credentials:FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
  ) {


    this.credentials = this.fb.group({
      email: ['', Validators.required]
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


  async reset_password() {
    console.log('email: ',this.credentials.get('email')?.value)
    const loading = await this.loadingController.create()
    await loading.present()

    this.authService.reset_password(this.credentials.get('email')?.value).then(async (data) => {
      await loading.dismiss()
      if (data.error) {
        this.showAlert('Reseteo de contraseña fallido', data.error.message) 
      }
      else {
        this.showAlert('¡Email enviado!', 'Revisa tu correo y sigue las instrucciones')
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


  ngOnInit() {
  }

}
