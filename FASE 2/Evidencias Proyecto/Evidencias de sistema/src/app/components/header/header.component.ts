import { Component, Input } from '@angular/core';
import { AvatarPopoverComponent } from '../avatar-popover/avatar-popover.component';
import { NavController, PopoverController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent {
  @Input() title: string = 'Acme App';
  isHomePage!: boolean;

  constructor(private popoverController: PopoverController, private router: Router, private navCtrl: NavController) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = this.router.url === '/home' || this.router.url === '/home-superadmin' || this.router.url === '/';
      }
    });
  }

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

  goBack(){
    this.navCtrl.back();
  }

  
}
