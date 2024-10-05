import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-superadmin',
  templateUrl: './home-superadmin.page.html',
  styleUrls: ['./home-superadmin.page.scss'],
})
export class HomeSuperadminPage implements OnInit {

  constructor(private router: Router) { }

  //Aqui cree un page aparte para el superadmin de forma temporal, en otro momento se corrige y se maneja en un puro home por medio del rol
  itemsHome = [
    { icon: 'qr-code-outline', titulo: 'Gestión de Categorías', descripcion: 'Gestiona las categorías disponibles para los productos', route: '/listar-categorias' },
    { icon: 'card-outline', titulo: 'Gestión de productos', descripcion: 'Gestiona los productos disponibles para el escaneo', route: '/listar-productos' },
  ];

  ngOnInit() {
  }

  redirigir(route: string) {
    this.router.navigate([route]);
  }

}
