import { AuthService } from './../../services/auth.service'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, Validators, FormGroup } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import { LoadingController, AlertController } from '@ionic/angular'


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {


  
  ngOnInit() {
    this.resetToken = this.route.snapshot.queryParamMap.get('access_token');
  }
  
  
  credentials:FormGroup;
  resetToken: string | null | undefined;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
  ) {


    this.credentials = this.fb.group({
      chpassword: ['', [Validators.required, Validators.minLength(6)]],
      chpassword2: ['', Validators.required]
      
    }, { validator: this.coincidenciaPassword })
    


    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.router.navigateByUrl('/groups', { replaceUrl: true })
      }
    })
  }

  coincidenciaPassword(group: FormGroup) {
    const chpassword = group.get('chpassword')?.value;
    const chpassword2 = group.get('chpassword2')?.value;
    return chpassword === chpassword2 ? null : { diferentes: true };
  }

  get password() {
    return this.credentials.get('chpassword')?.value;
  }

  async change_password() {
    const newPassword = this.credentials.get('chpassword')?.value;
    const loading = await this.loadingController.create()
    await loading.present()
    // Call the AuthService to reset the password using the token
    this.authService.changePassword(newPassword).then(async (response) => {
      if (response.error) {
        await loading.dismiss()
        await this.showError('Error', response.error.message);
      } else {
        await loading.dismiss()
        await this.showAlert('¡Contraseña Cambiada!', '¡Ya puedes volver a iniciar sesión en ScanBuy!');
      }
    });
  }


  async showAlert(title:string, msg:any) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    })
    await alert.present()
    this.router.navigate(['/login']);
  }

  async showError(title:string, msg:any) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    })
    await alert.present()
  }





}


