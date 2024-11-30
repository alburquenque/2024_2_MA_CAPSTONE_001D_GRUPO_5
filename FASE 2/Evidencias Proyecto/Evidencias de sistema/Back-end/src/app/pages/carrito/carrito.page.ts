import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CarritoService } from 'src/app/services/carrito.service';
import { AuthService } from 'src/app/services/auth.service';
import { PagoService } from 'src/app/services/pago.service';
import { LoadingController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  
  itemsCarrito: any[] = [];
  userId!: string;
  total: number = 0;
  loadingItem: string | null = null;

  constructor(private carritoService: CarritoService, 
              private authService: AuthService, 
              private pagoService: PagoService, 
              private loadingController: LoadingController, 
              private platform: Platform, 
              private router:Router,
              private cdr: ChangeDetectorRef,) { 
  }

  async ngOnInit() {
    this.userId = await this.authService.getCurrentUserId();
    this.carritoService.itemsCarrito$.subscribe((items) => {
      items = items.sort((a: any, b: any) => a.precio_unitario - b.precio_unitario);
      this.itemsCarrito = items;
      this.calcularTotal();
      this.DelayCarrito()
    });
    await this.actualizarItemsCarrito();
    
  }



  async calcularTotal() {
    this.total = this.itemsCarrito.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0);
  }


  formatearPesos(valor: number): string {
    return '$' + valor.toLocaleString('es-CL');
  }

  async actualizarItemsCarrito() {
    try {
      const carrito = await this.authService.getCarrito(this.userId);
      console.log("id del carrito: ", carrito.id_carrito)
      
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
    if (this.loadingItem) return; // Evita actualizaciones paralelas
    this.loadingItem = item.id_refcarrito;
    const nuevaCantidad = item.cantidad + cambio;


    if (nuevaCantidad > 0) {
      await this.carritoService.actualizarCantidadProducto(nuevaCantidad, item.id_refcarrito);
      
      await this.carritoService.actualizarTotalEnRef(nuevaCantidad, item.id_refcarrito, item.precio_unitario);
      
      const carrito = await this.carritoService.obtenerProductosCarrito(item.id_carrito)
      if (carrito){
        const total = carrito.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0);
        console.log("El total ahora es: ", total)
        await this.carritoService.actualizarTotalEnCarrito(total, item.id_carrito);

        const cantidad_total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        console.log("cantidad_total nueva: ", cantidad_total)
        await this.carritoService.actualizarCantidadEnCarrito(cantidad_total, item.id_carrito);
      }
      this.loadingItem = null; // Limpia el estado de carga

      
    } else {
      await this.eliminarProducto(item);}
    await this.actualizarItemsCarrito();
  }

  
  async eliminarProducto(item: any) {
    await this.carritoService.eliminarItemCarrito(item.id_refcarrito);
    const carrito = await this.authService.getCarrito(this.userId)
    const cantidad_nueva = carrito.cantidad - item.cantidad;
    const total_nuevo = carrito.total - item.total;
    await this.carritoService.actualizarCantidadEnCarrito(cantidad_nueva, item.id_carrito);
    await this.carritoService.actualizarTotalEnCarrito(total_nuevo, item.id_carrito);
    await this.actualizarItemsCarrito();
  }

  async limpiarCarrito() {
    await this.carritoService.limpiarCarrito(this.userId);
    await this.actualizarItemsCarrito();
    console.log("La limpieza funciona...")
  }

  async iniciarPago() {
    const loading = await this.loadingController.create({
      message: 'Iniciando pago...',
      translucent: true
    });
    await loading.present();
  
    try {
      const returnUrl = 'https://webpay-scanbuy.onrender.com/api/pago/redirect';
  
      const paymentData = {
        amount: Math.round(this.total),
        buyOrder: 'ORDEN' + Date.now(),
        sessionId: 'SESION' + Date.now(),
        returnUrl: returnUrl
      };
  
      this.pagoService.initiatePayment(paymentData).subscribe({
        next: (response) => {
          loading.dismiss();
          if (response?.url && response?.token) {
            window.location.href = `${response.url}?token_ws=${response.token}`;
          } else {
            throw new Error('Respuesta de WebPay incompleta');
          }
        },
        error: (error) => {
          loading.dismiss();
          console.error('Error al iniciar pago:', error);
          this.presentError('Error al iniciar el pago. Por favor, intenta nuevamente.');
        }
      });
    } catch (error) {
      loading.dismiss();
      console.error('Error en la transacción:', error);
      this.presentError('Error al procesar el pago. Por favor, intenta nuevamente.');
    }
  }

  async presentError(message: string) {
    alert(message);
  }

  //Para actualizar después de un tiempo el carrito
  DelayCarrito() {
    setTimeout(() => {
      this.cdr.detectChanges(); // Llama a la función deseada
      console.log("si vine al timer")
    }, 1500); // Tiempo en milisegundos (3000 ms = 3 segundos)
  }

  routerLink(){
    this.router.navigateByUrl('/scanner', { replaceUrl: true })
}

}






