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
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', Validators.required]
      
    }, { validator: this.coincidenciaPassword })
    


    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.router.navigateByUrl('/groups', { replaceUrl: true })
      }
    })
  }

  coincidenciaPassword(group: FormGroup) {
    const password = group.get('password')?.value;
    const password2 = group.get('password2')?.value;
    return password === password2 ? null : { diferentes: true };
  }

  get password() {
    return this.credentials.get('password')?.value;
  }

  async change_password() {
    const newPassword = this.credentials.get('password')?.value;

    // Call the AuthService to reset the password using the token
    this.authService.changePassword(newPassword).then(async (response) => {
      if (response.error) {
        this.showError('Error', response.error.message);
      } else {
        this.showAlert('¡Contraseña Cambiada!', '¡Ya puedes volver a iniciar sesión en ScanBuy!');
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


