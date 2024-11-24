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
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService, 
    private router: Router, 
    private platform: Platform, 
    private authguard: AuthGuard
  ) {
    this.addAllIcons();
    this.initializeApp(); // Llamamos a initializeApp en el constructor
  }

  async ngOnInit() {
    await this.authService.initializeSession();
    console.log('Session ha sido restaurada');
  }

  addAllIcons() {
    addIcons({
      closeOutline
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Configuramos el listener para deep links
      App.addListener('appUrlOpen', (event: any) => {
        console.log('Deep link recibido:', event);
        
        // Manejamos tanto el esquema personalizado como la URL de WebPay
        if (event.url.includes('com.scanbuy.app://')) {
          const slug = event.url.split('com.scanbuy.app://').pop();
          if (slug) {
            const urlParams = new URLSearchParams(slug.split('?')[1]);
            const token = urlParams.get('token_ws');
            
            if (token) {
              console.log('Token recibido:', token);
              this.router.navigate(['/payment/confirmation'], {
                queryParams: { token_ws: token }
              });
            }
          }
        } else if (event.url.includes('webpay-scanbuy.onrender.com')) {
          // Manejamos la redirección desde WebPay
          const url = new URL(event.url);
          const token = url.searchParams.get('token_ws');
          
          if (token) {
            console.log('Token recibido desde WebPay:', token);
            this.router.navigate(['/payment/confirmation'], {
              queryParams: { token_ws: token }
            });
          }
        }
      });
    });
  }
}