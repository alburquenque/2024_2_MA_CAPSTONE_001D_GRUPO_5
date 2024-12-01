import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private router: Router,
              private authService: AuthService
  ) {}

  

  ngOnInit() {
    const current =  this.authService.getCurrentUser()
    if (current){
      setTimeout(() => {
        this.router.navigateByUrl('/home');
      }, 2000);
    }
    else{
      setTimeout(() => {
        this.router.navigateByUrl('/login');
      }, 2000);
    }

  }

}
