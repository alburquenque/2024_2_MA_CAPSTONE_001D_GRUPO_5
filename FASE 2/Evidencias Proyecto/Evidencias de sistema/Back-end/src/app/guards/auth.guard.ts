import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return from(this.authService.checkSession()).pipe(
      switchMap(isLoggedIn => {
        return this.authService.getCurrentUser().pipe(
          take(1),
          map(user => {
            if (user && user !== true && isLoggedIn) {
              return true;
            } else {
              return this.router.createUrlTree(['/login']);
            }
          })
        );
      })
    );
  }

  

  
}