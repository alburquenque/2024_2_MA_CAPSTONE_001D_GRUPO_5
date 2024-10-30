import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'src/app/services/carrito.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  
  itemsCarrito: any[] = [];
  userId!: string;
  total: number = 0;

  constructor(private carritoService: CarritoService, private authService: AuthService) {
    (window as any).checkCardHeight = this.CheckCard.bind(this);
  }

  async ngOnInit() {
    this.userId = await this.authService.getCurrentUserId();
    this.carritoService.itemsCarrito$.subscribe((items) => {
      this.itemsCarrito = items;
      this.calcularTotal();

    });
    await this.actualizarItemsCarrito();
  }

  calcularTotal() {
    this.total = this.itemsCarrito.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0);
  }


  async actualizarItemsCarrito() {
    try {
      const carrito = await this.authService.getCarrito(this.userId);
      
      if (carrito && carrito.id_carrito) {
        const items = await this.carritoService.obtenerProductosCarrito(carrito.id_carrito);
        
        // Asegurarse de que items no sea null, asignar un array vacío si lo es
        this.carritoService.promesaItemsCarrito.next(items ?? []);  
      } else {
        console.error("El carrito es nulo o no tiene un id_carrito válido.");
        this.carritoService.promesaItemsCarrito.next([]);  
      }
    } catch (error) {
      console.error("Error al actualizar los ítems del carrito: ", error);
      this.carritoService.promesaItemsCarrito.next([]);  
    }
  }

  async actualizarCantidad(item: any, cambio: number) {
    const nuevaCantidad = item.cantidad + cambio;
    const nuevoTotal = item.cantidad*item.precio_unitario
    if (nuevaCantidad > 0) {
      await this.carritoService.actualizarCantidadProducto(nuevaCantidad, item.id_refcarrito);
      await this.carritoService.actualizarCantidadEnCarrito(nuevaCantidad, item.id_carrito);
      await this.carritoService.actualizarTotalEnCarrito(nuevoTotal, item.id_carrito);
      await this.carritoService.actualizarTotalEnRef(nuevaCantidad, item.id_refcarrito, item.precio_unitario);
    } else {
      await this.eliminarProducto(item);}
    await this.actualizarItemsCarrito();
  }

  
  async eliminarProducto(item: any) {
    await this.carritoService.eliminarItemCarrito(item.id_refcarrito);
    await this.actualizarItemsCarrito();
  }

  async limpiarCarrito() {
    await this.carritoService.limpiarCarrito(this.userId);
    await this.actualizarItemsCarrito();
    console.log("La limpieza funciona...")
  }





  //Temas de diseño

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.CheckCard(); // Llama a la función después de un pequeño retraso
    }, 100);
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
