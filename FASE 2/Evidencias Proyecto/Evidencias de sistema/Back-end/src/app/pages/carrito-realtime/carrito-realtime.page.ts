import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-carrito-realtime',
  templateUrl: './carrito-realtime.page.html',
  styleUrls: ['./carrito-realtime.page.scss'],
})
export class CarritoRealtimePage implements OnInit {

  carritos : any
  constructor(private router: Router, 
              private popoverController: PopoverController,
              private authService: AuthService) { }

  ngOnInit() {
    this.obtenerCarritos()
  }
  
  async irAlDetalle(id:any) {
    try {
      await this.popoverController.dismiss(); // Intenta cerrar el popover solo si está presente
    } catch (error) {
      //console.log('Popover no estaba presente:', error);
    }
    //console.log('asi es');
    localStorage.setItem('id_usuario', id)
    this.router.navigate(['/detalle-carritos']);
  } 

  async obtenerCarritos(){
    this.carritos =  await this.authService.getCarritoRealtime()
    console.log("carritos: ",this.carritos)
  }
  
}
