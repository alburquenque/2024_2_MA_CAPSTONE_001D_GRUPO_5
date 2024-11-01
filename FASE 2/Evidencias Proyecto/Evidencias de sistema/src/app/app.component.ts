import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons'
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {


  constructor(private authService: AuthService, private router: Router) {
    this.addAllIcons();
  }

  addAllIcons(){
      addIcons({
      closeOutline
    });
    };


    ngOnInit() {
      this.checkSession();
    }


    async checkSession() {
      const isLoggedIn = await this.authService.checkSession();
      if (isLoggedIn) {
        this.router.navigateByUrl('/home'); // redirige si no está autenticado
      }
    }
}
