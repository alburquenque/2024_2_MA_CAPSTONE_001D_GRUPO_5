import { Component } from '@angular/core';

@Component({
  selector: 'app-carrito',
  templateUrl: 'carrito.page.html',
  styleUrls: ['carrito.page.scss'],
})
export class CarritoPage {
  itemCount: number = 1;

  constructor() {}

  addItem() {
    this.itemCount++;
  }

  removeItem() {
    if (this.itemCount > 0) {
      this.itemCount--;
    }
  }
}

