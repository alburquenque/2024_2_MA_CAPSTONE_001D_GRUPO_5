import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-avatar-popover',
  templateUrl: './avatar-popover.component.html',
  styleUrls: ['./avatar-popover.component.scss'],
})
export class AvatarPopoverComponent {

  constructor(private popoverController: PopoverController, private router: Router) { }

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
}
