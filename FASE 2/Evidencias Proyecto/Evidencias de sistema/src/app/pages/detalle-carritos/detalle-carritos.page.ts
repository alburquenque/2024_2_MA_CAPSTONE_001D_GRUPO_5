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

  itemCount: number = 1;

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.CheckCard(); // Llama a la función después de un pequeño retraso
    }, 100);
  }

  irCarritoRealtime() {
    this.router.navigate(['/carrito-realtime']);
    close
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
