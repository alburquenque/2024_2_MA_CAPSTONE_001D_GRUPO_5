import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router'
import { HistorialService } from 'src/app/services/historial.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  localUserData: any; 
  compras: any[] = [];

  constructor(private authService: AuthService, 
              private router: Router,
              private historialService: HistorialService) { }

  ngOnInit() {
    console.log("si llegué")
    this.localUserData = this.authService.getLocalUserData(); // Llamada correcta
    console.log('Datos del usuario en localStorage:', this.localUserData);
    this.obtenerdatos()
    
  }

  async obtenerdatos() {
    try {
      // Espera a que se resuelva la promesa
      this.compras = await this.historialService.getCompras(this.localUserData.id_usuario);
  
      // Ahora deberías tener el resultado en `this.compras`
      console.log("El historial de compras es: ", this.compras);
    } catch (error) {
      console.error("Error obteniendo el historial de compras: ", error);
    }
  }

  async irAlDetalle(id:any) {
    localStorage.setItem('id_voucher', id)
    this.router.navigate(['/historial-detalles']);
  } 

  async irAlScanner(){
    this.router.navigate(['/scanner'])
  }


}
