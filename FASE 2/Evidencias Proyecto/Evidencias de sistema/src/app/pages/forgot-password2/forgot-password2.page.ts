import { AuthService } from './../../services/auth.service'
import { Component, OnInit, AfterViewInit } from '@angular/core'
import { FormBuilder, Validators, FormGroup } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { LoadingController, AlertController } from '@ionic/angular'


@Component({
  selector: 'app-forgot-password2',
  templateUrl: './forgot-password2.page.html',
  styleUrls: ['./forgot-password2.page.scss'],
})
export class ForgotPassword2Page implements OnInit {

  credentialsFP2!:FormGroup;
  email:any;

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

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.email = navigation.extras.state['email'];
    }
  }

  ionViewWillEnter() {
    const inputs = document.querySelectorAll('input[formControlName]');
    inputs.forEach((input) => {
      input.addEventListener('paste', (event: any) => this.handlePaste(event));
    });
  }

  ngOnInit() {
    this.initForm();
    this.credentialsFP2.updateValueAndValidity();
  }

  initForm() {
    this.credentialsFP2 = this.fb.group({
      codigo1: ['', [Validators.required, Validators.pattern('^[0-9]{1}$')]],
      codigo2: ['', [Validators.required, Validators.pattern('^[0-9]{1}$')]],
      codigo3: ['', [Validators.required, Validators.pattern('^[0-9]{1}$')]],
      codigo4: ['', [Validators.required, Validators.pattern('^[0-9]{1}$')]],
      codigo5: ['', [Validators.required, Validators.pattern('^[0-9]{1}$')]],
      codigo6: ['', [Validators.required, Validators.pattern('^[0-9]{1}$')]]

    })
  }

  get f() { return this.credentialsFP2.controls; }


  async check_otp(){
    const codigo = this.credentialsFP2.value.codigo1+this.credentialsFP2.value.codigo2+this.credentialsFP2.value.codigo3+this.credentialsFP2.value.codigo4+this.credentialsFP2.value.codigo5+this.credentialsFP2.value.codigo6
    const loading = await this.loadingController.create()
    console.log("codigo: ", codigo)
    console.log("email: ",this.email)
    await loading.present()
    try{
      const response = await this.authService.verifyOTP(this.email, codigo)
      if (response.error) {  
        await loading.dismiss()
        await this.showAlert('Error', "El código OTP es incorrecto o ha expirado.") 
        console.log("error: ",response.error)
      } else {
        this.credentialsFP2.reset()
        await loading.dismiss()
        console.log("Verificación exitosa");
        setTimeout(() => {
          this.router.navigate(["/change-password"])
        }, 0);

        // Muestra un mensaje de error o maneja el fallo
      }
    }
    catch(error){
      console.log("no se pudo manito")
    }
    
  }

  routerLink(){
    this.credentialsFP2.reset()
    setTimeout(() => {
      this.router.navigate(["/login"])
    }, 0);
  }

  
  async showAlert(title:string, msg:any) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    })
    await alert.present()
  }









  //Todo esto es para que funcione el tema de los cuadrados
  focusNext(event: Event, nextInputId: string) {
    const target = event.target as HTMLInputElement | null;
    if (target && target.value.length === 1) {
      const nextInput = document.querySelector(`input[formControlName="${nextInputId}"]`) as HTMLInputElement | null;
      nextInput?.focus();
    }
  }

  handleBackspace(event: KeyboardEvent, currentInputId: string) {
    // Verifica si la tecla presionada es 'Backspace'
    if (event.key === 'Backspace') {
      const currentInput = event.target as HTMLInputElement;
      
      // Verifica si el valor actual está vacío
      if (currentInput.value.length === 0) {
        // Selecciona el input anterior
        const previousInput = document.querySelector(`input[formControlName="${currentInputId}"]`)?.previousElementSibling as HTMLInputElement | null;
        previousInput?.focus();
      }
    }
  }

  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
  
    const pastedData = event.clipboardData?.getData('Text')?.trim();
  
    if (pastedData && pastedData.length === 6) {
      const inputs = document.querySelectorAll('input[formControlName]');
      inputs.forEach((input, index) => {
        if (index < pastedData.length) {
          (input as HTMLInputElement).value = pastedData[index];
        }
      });
  
      // Actualiza el valor de `credentials` manualmente
      this.credentialsFP2.patchValue({
        codigo1: pastedData[0],
        codigo2: pastedData[1],
        codigo3: pastedData[2],
        codigo4: pastedData[3],
        codigo5: pastedData[4],
        codigo6: pastedData[5],
      });
  
      // Enfoca el último campo lleno
      const lastInput = document.querySelector('input[formControlName="codigo6"]') as HTMLInputElement;
      lastInput.focus();
    }
  }
  
  

}
