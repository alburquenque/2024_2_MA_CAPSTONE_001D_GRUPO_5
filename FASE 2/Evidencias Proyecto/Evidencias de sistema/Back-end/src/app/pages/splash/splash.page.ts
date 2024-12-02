import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  localUserData:any = null

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Escuchar eventos de navegación para detectar cuando se visita la página
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd && this.router.url === '/splash'))
      .subscribe(() => {
        this.checkAuthentication();
      });
  }

  ngOnInit() {
    // Ejecutar la lógica inicial
    this.checkAuthentication();
  }

  private async checkAuthentication() {
    this.localUserData = await this.authService.getLocalUserData();
    console.log(this.localUserData)
    const current = await this.authService.getCurrentUser();
    if (this.localUserData) {
      console.log("lo mandé al home");
      setTimeout(() => {
        this.router.navigateByUrl('/home');
      }, 2000);
    } else {
      console.log("lo mandé al login");
      setTimeout(() => {
        this.router.navigateByUrl('/login');
      }, 2000);
    }
  }
}
