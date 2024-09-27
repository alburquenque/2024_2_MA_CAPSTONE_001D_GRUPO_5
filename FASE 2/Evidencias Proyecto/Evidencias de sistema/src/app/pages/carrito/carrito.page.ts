import { Component } from '@angular/core';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage  {

  
  itemCount: number = 1;

  constructor() {
    (window as any).checkCardHeight = this.CheckCard.bind(this);
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.CheckCard(); // Llama a la función después de un pequeño retraso
    }, 100);
  }

  addItem() {
    this.itemCount++;
  }

  removeItem() {
    if (this.itemCount > 0) {
      this.itemCount--;
    }
  }
 //Pa chequear el tamaño del card y que se modifique cuando sea <700px
  CheckCard() {
    const card = document.querySelector('ion-card');
    if (card) {
      const cardHeight = card.clientHeight;
      const cardContent = card.querySelector('ion-card-content');
      if (cardContent) { 
        console.log("La altura ahora es de",cardHeight)
        if (cardHeight < 700) {
          cardContent.classList.remove('paddingCarrito'); 
        } else {
          cardContent.classList.add('paddingCarrito'); 
        }
      }
    }
  }


}
