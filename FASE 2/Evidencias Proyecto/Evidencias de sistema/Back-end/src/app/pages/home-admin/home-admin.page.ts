import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
})
export class HomeAdminPage implements OnInit {


  localUserData: any; 
  user: any; // Variable para almacenar los datos del usuario
  user_id : any
  isLoading = true; 
  usuario : any = ''

  itemsHome = [
    { icon: 'qr-code-outline', link:'/scanner-qr', titulo: 'Escanear Voucher', descripcion: 'Escanea un voucher de compra para finalizar la compra de un usuario' },
    { icon: 'cart-outline', link:'/carrito-realtime', titulo: 'Carritos Usuarios', descripcion: 'Supervisa en tiempo real los carritos activos de los usuarios' },
  ];


  constructor(private authService: AuthService, private router: Router) { }
  
  ngOnInit() {
    if (!localStorage.getItem('reloaded')) {
      localStorage.setItem('reloaded', 'true'); // Marca la recarga
      location.reload(); // Recarga la página
    }
    this.localUserData = this.authService.getLocalUserData(); // Llamada correcta
    console.log('Datos del usuario en localStorage:', this.localUserData);
  }
  

  async obtenerDatos() {
    this.authService.getCurrentUser().subscribe(async (user: any) => {
      if (user) {
        this.user_id = user.id; // Acceder al ID del usuario
        try {
          this.usuario = await this.authService.getUserDetails(this.user_id); // Esperar a que la promesa se resuelva
          console.log("Usuario obtenido: ", this.usuario);
        } catch (error) {
          console.error("Error al obtener detalles del usuario: ", error);
        }
      } else {
        console.error("No se pudo obtener el usuario");
      }
    });
  }

  alScanner() {
    this.router.navigate(['/scanner-qr']); 
  }

}
