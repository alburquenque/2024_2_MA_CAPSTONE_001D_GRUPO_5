import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
  export class RoleGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
  
    canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> {


      
      const requiredRoles: number[] = next.data['roles'];
      return this.authService.getUserRole().pipe(
        map(role => {
          if (role === null) {
            return this.router.createUrlTree(['/login']);
          }
  
          if (requiredRoles.includes(role)) {
            return true;
          }
  
          // Redirigir según el rol
          switch (role) {
            case 3:
              return this.router.createUrlTree(['/home-superadmin']);
            case 2:
              return this.router.createUrlTree(['/home-admin']);
            default:
              return this.router.createUrlTree(['/home']);
          }
        })
      );
    }
  }
  