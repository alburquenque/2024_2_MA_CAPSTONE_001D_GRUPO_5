import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ReportesService } from 'src/app/services/reportes.service';

@Component({
  selector: 'app-home-superadmin',
  templateUrl: './home-superadmin.page.html',
  styleUrls: ['./home-superadmin.page.scss'],
})
export class HomeSuperadminPage implements OnInit {
  localUserData: any; 
  usuarioRegistrado: any
  totalCompras: any
  productosAgregados: any
  
  constructor(private router: Router,
              private authService: AuthService,
              private reportesSerive: ReportesService) { }
  
  
  lastActivity: Date = new Date();


  //Aqui cree un page aparte para el superadmin de forma temporal, en otro momento se corrige y se maneja en un puro home por medio del rol

  
  itemsHome = [
    { icon: 'apps-outline', titulo: 'Gestión de Categorías', descripcion: 'Gestiona las categorías disponibles para los productos', route: '/listar-categorias' },
    { icon: 'cube-outline', titulo: 'Gestión de productos', descripcion: 'Gestiona los productos disponibles para el escaneo', route: '/listar-productos' },
    { icon: 'stats-chart-outline', titulo: 'Reportes y Analíticas', descripcion: 'Visualiza los reportes y analíticas de los productos escaneados', route: '/reportes' },
  ];

  async ngOnInit() {
    this.actualizarUltimaActividad();
    this.localUserData = this.authService.getLocalUserData(); // Llamada correcta
    console.log('Datos del usuario en localStorage:', this.localUserData);
    await this.obtenerReportes()
  }

  actualizarUltimaActividad() {
    this.lastActivity = new Date();
  }

  redirigir(route: string) {
    this.router.navigate([route]);
  }

  mostrarGuia() {
    // Abre un modal o página con la documentación del sistema
  }
  
  contactarSoporte() {
    // Abre el chat de soporte o formulario de contacto
  }
  
  reportarProblema() {
    // Abre el formulario de reporte de bugs
  }

  async obtenerReportes(){
    this.usuarioRegistrado = await this.reportesSerive.obtenerTotalUsuarios()
    this.totalCompras = await this.reportesSerive.obtenerTotalCompras()
    this.productosAgregados = await this.reportesSerive.obtenerTotalProductosEnCarrito()
    console.log("1: ", this.usuarioRegistrado)
    console.log("2: ", this.totalCompras)
    console.log("3: ", this.productosAgregados)
  }


}
