import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
})
export class HomeAdminPage implements OnInit {

  itemsHome = [
    { icon: 'qr-code-outline', link:'/scanner-qr', titulo: 'Escanear Voucher', descripcion: 'Escanea un voucher de compra para finalizar la compra de un usuario' },
    { icon: 'cart-outline', link:'/carrito-realtime', titulo: 'Carritos Usuarios', descripcion: 'Supervisa en tiempo real los carritos activos de los usuarios' },
  ];

  localUserData: any; 

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.localUserData = this.authService.getLocalUserData();
  }

}
