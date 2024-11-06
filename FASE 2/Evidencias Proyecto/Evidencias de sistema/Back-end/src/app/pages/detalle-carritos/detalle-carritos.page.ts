import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-detalle-carritos',
  templateUrl: './detalle-carritos.page.html',
  styleUrls: ['./detalle-carritos.page.scss'],
})
export class DetalleCarritosPage implements OnInit {

  constructor(private router: Router, 
              private popoverController: PopoverController,
              private authService: AuthService) { }

  itemCount: number = 1;
  carritos: any

  ngOnInit() {
    this.obtenerDatos(localStorage.getItem('id_usuario'))
    console.log("se obtuvieron los datos")
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


  async obtenerDatos(id:any){
    this.carritos = await this.authService.getDetallesCarritoRealtime(id)
    console.log("Este es el carrito: ", this.carritos)
    console.log("Refcarrito: ", this.carritos.carrito)
  }
}
