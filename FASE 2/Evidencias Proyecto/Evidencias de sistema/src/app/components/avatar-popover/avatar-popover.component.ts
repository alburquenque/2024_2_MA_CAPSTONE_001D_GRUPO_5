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

  constructor(private popoverController: PopoverController, private router: Router, private authService: AuthService) { }

  dismissPopover(action: string) {
    this.popoverController.dismiss({
      action: action
    });
  }
  irAlHome() {
    this.router.navigate(['/home']);
  }  

  irAlPerfil() {
    this.router.navigate(['/perfil']);
  }  

  irAlLogin() {
    this.router.navigate(['/login']);
  }  

  logout() {
    this.authService.signOut().then(() => {
      this.router.navigateByUrl('/login', { replaceUrl: true }); // Redirige al login después de cerrar sesión
    });
  }
}
