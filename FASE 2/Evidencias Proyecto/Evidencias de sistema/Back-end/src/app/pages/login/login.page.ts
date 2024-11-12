import { AuthService } from './../../services/auth.service'
import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { FormBuilder, Validators, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { LoadingController, AlertController } from '@ionic/angular'


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  
  credentialsLogin!:FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {


    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.router.navigateByUrl('/home', { replaceUrl: true })
      }
    })
  }

  ionViewWillEnter() {
    this.initForm(); 
  }

  ngOnInit() {
    this.initForm()
  }


  initForm() {
    this.credentialsLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }




  get email() {
    return this.credentialsLogin.get('email')?.value;
  }

  get password() {
    return this.credentialsLogin.get('password')?.value;
  }

  async login() {
    const loading = await this.loadingController.create({
       message: 'Iniciando sesión, espere un momento...' 
    })
    await loading.present()

    await this.authService.signIn(this.credentialsLogin.getRawValue()).then(async (data) => {

      if (data.error) {
        await loading.dismiss()
        return this.showAlert('Inicio de sesión fallido', data.error.message) 
      }
      else {
        await loading.dismiss()
        this.router.navigate(['/home']);
        this.cdr.detectChanges()
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
