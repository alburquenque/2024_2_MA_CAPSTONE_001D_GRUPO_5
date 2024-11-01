import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  itemsHome = [
    { icon: 'qr-code-outline', link:'/scanner', titulo: 'Escanear Código de Barras', descripcion: 'Escanea el código de barras para añadir un producto al carrito' },
    { icon: 'card-outline', link:'/', titulo: 'Gestionar Pago', descripcion: 'Gestiona el método de pago a utilizar para tus compras' },
    { icon: 'cube-outline', link:'/', titulo: 'Historial de compras', descripcion: 'Observa tu historial de compras realizadas usando la aplicación' },
    { icon: 'settings-outline', link:'/', titulo: 'Ajustes', descripcion: 'Configura ciertos aspectos de la aplicación' },

  ];

  localUserData: any; 

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.localUserData = this.authService.getLocalUserData();
  }

}
