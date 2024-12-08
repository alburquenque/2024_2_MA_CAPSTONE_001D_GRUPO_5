import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AuthSession, User } from '@supabase/supabase-js';
import { EditarPerfilPage } from '../editar-perfil/editar-perfil.page';
import { ChangeDetectorRef } from '@angular/core';
import { EditPasswordPage } from '../edit-password/edit-password.page';
import { Router } from '@angular/router'

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  user: User | null = null;
  nombre: string = '';
  apellido: string = ''; 
  localUserData: any; 
  
  constructor(private modalCtrl: ModalController, 
              private authService: AuthService,
              private cdr: ChangeDetectorRef,
              private router: Router) {}

 ngOnInit() {
  this.localUserData = this.authService.getLocalUserData();
  console.log('La info del local user ',this.localUserData)
}

  message = 'This modal example uses the modalController to present and dismiss modals.';



  async openModal() {
    const modal = await this.modalCtrl.create({
      component: EditarPerfilPage,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log("Se confirmó")
      this.localUserData = this.authService.getLocalUserData();
      this.cdr.detectChanges();

    }
  }

  async openModal2() {
    const modal = await this.modalCtrl.create({
      component: EditPasswordPage,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.message = `Hello, ${data}!`;
    }
  }

  goToScanner() {
    this.router.navigateByUrl('/scanner', { replaceUrl: true }) // Cambia '/scanner' por la ruta de tu página Scanner
  }

  goToHome(){
    this.router.navigateByUrl('/home', { replaceUrl: true })
  }
}
