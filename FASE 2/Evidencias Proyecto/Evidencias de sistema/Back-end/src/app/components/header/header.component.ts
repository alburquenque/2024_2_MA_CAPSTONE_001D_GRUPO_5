import { Component, Input } from '@angular/core';
import { AvatarPopoverComponent } from '../avatar-popover/avatar-popover.component';
import { NavController, PopoverController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent {
  @Input() title: string = 'Acme App';
  isHomePage!: boolean;
  localUserData: any; 
  rolUsuario: number |  null = null;

  constructor(private popoverController: PopoverController, private router: Router, private navCtrl: NavController, private authService: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = this.router.url === '/home' || this.router.url === '/home-superadmin' || this.router.url === '/home-admin' || this.router.url === '/';
      }
      this.authService.getUserRole().subscribe((rol) => {
        this.rolUsuario = rol;
      });
    });
  }

  ngOnInit() {
    this.localUserData = this.authService.getLocalUserData();
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
