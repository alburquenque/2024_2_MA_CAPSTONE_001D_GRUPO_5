import { Component, Input } from '@angular/core';
import { AvatarPopoverComponent } from '../avatar-popover/avatar-popover.component';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent {
  @Input() title: string = 'Acme App';

  constructor(private popoverController: PopoverController, private router: Router) {}

  irAlCarrito() {
    this.router.navigate(['/carrito']);
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: AvatarPopoverComponent,
      event: ev,
      translucent: true,
      side: 'bottom',
      alignment: 'end'
    });
    return await popover.present();
  }
}
