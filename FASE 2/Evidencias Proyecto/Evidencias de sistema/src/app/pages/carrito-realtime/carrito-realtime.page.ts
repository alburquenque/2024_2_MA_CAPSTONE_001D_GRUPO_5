import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito-realtime',
  templateUrl: './carrito-realtime.page.html',
  styleUrls: ['./carrito-realtime.page.scss'],
})
export class CarritoRealtimePage implements OnInit {

  constructor( private router: Router, private popoverController: PopoverController) { }

  ngOnInit() {
  }
  
  async irAlDetalle() {
    try {
      await this.popoverController.dismiss(); // Intenta cerrar el popover solo si está presente
    } catch (error) {
      console.log('Popover no estaba presente:', error);
    }
    console.log('asi es');
    this.router.navigate(['/detalle-carritos']);
  } 
}
