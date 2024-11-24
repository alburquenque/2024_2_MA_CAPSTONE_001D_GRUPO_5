import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-avatar-popover',
  templateUrl: './avatar-popover.component.html',
  styleUrls: ['./avatar-popover.component.scss'],
})
export class AvatarPopoverComponent {
  localUserData: any; 

  constructor(private popoverController: PopoverController, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.localUserData = this.authService.getLocalUserData(); // Llamada correcta
    console.log('Datos del usuario en localStorage:', this.localUserData);
  }

  dismissPopover(action: string) {
    this.popoverController.dismiss({
      action: action
    });
  }
  irAlHome() {
    this.popoverController.dismiss()
    this.router.navigate(['/home']);
  }  

  irAlPerfil() {
    this.popoverController.dismiss()
    this.router.navigate(['/perfil']);
  }  

  irAlLogin() {
    this.popoverController.dismiss()
    this.router.navigate(['/login']);
  }  

  logout() {
    this.authService.signOut().then(() => {
      this.popoverController.dismiss()
      this.router.navigateByUrl('/login', { replaceUrl: true }); // Redirige al login después de cerrar sesión
    });
  }
}
