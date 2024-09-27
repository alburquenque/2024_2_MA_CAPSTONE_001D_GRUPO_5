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
  // Aqui se va tener que modificar para que lo filtre por ID del cliente y sus productos pero ya despues.
  async irAlDetalle() {
    await this.popoverController.dismiss();
    this.router.navigate(['/detalle-carritos']);
    close
  }  
}
