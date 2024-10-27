  import { AuthService } from './../../services/auth.service'
  import { Component, OnInit } from '@angular/core'
  import { FormBuilder, Validators, FormGroup } from '@angular/forms'
  import { Router, RouterLink } from '@angular/router'
  import { LoadingController, AlertController } from '@ionic/angular'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  credentialsFP!:FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
  ) {



    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.router.navigateByUrl('/groups', { replaceUrl: true })
      }
    })
  }

  get email() {
    return this.credentialsFP.get('email')?.value;
  }

  initForm() {
    this.credentialsFP = this.fb.group({
      email: ['', Validators.required]
    })
  }


  async reset_password() {
    console.log('email: ',this.credentialsFP.get('email')?.value)
    const loading = await this.loadingController.create()
    await loading.present()

    this.authService.reset_password(this.credentialsFP.get('email')?.value).then(async (data) => {
      await loading.dismiss()
      if (data.error) {
        this.showAlert('Envío de email fallido', data.error.message) 
      }
      else {
        await this.showAlert('¡Email enviado!', 'Revisa tu correo y sigue las instrucciones')
        this.router.navigate(['/forgot-password2'], { state: { email: this.credentialsFP.get('email')?.value } });
        
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
    this.initForm()
  }

  ionViewWillEnter() {
    this.initForm(); // Esto restablecerá el formulario
  }

}
