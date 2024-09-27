import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-detalle-carritos',
  templateUrl: './detalle-carritos.page.html',
  styleUrls: ['./detalle-carritos.page.scss'],
})
export class DetalleCarritosPage implements OnInit {

  constructor(private router: Router, private popoverController: PopoverController) { }

  ngOnInit() {
  }
  irCarritoRealtime() {
    this.router.navigate(['/carrito-realtime']);
    close
  }  
}
