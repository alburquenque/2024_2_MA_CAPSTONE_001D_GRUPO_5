import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { AuthGuard } from './guards/auth.guard';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  constructor(private authService: AuthService, private router: Router, private platform: Platform, private authguard : AuthGuard) {
    this.addAllIcons();
  }

  async ngOnInit() {
    await this.authService.initializeSession();
    console.log('Session a sido restaurada')
  }

  addAllIcons() {
    addIcons({
      closeOutline
    });
    }

  initializeApp() {
    this.platform.ready().then(() => {
      App.addListener('appUrlOpen', (event: any) => {
        console.log('Deep link recibido:', event);
        const slug = event.url.split('com.scanbuy.app://').pop();
        if (slug) {
          const urlParams = new URLSearchParams(slug.split('?')[1]);
          const token = urlParams.get('token_ws');
          
          this.router.navigate(['/payment/confirmation'], {
            queryParams: { token_ws: token }
          });
        }
      });
    });
  }

}
