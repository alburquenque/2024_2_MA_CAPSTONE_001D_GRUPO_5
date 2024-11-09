import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'src/app/services/carrito.service';
import { AuthService } from 'src/app/services/auth.service';
import { PagoService } from 'src/app/services/pago.service';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  
  itemsCarrito: any[] = [];
  userId!: string;
  total: number = 0;

  constructor(private carritoService: CarritoService, private authService: AuthService, private pagoService: PagoService, private loadingController: LoadingController) { 
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
    const nuevoTotal = nuevaCantidad*item.precio_unitario
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
    await this.carritoService.actualizarCantidadEnCarrito(0, item.id_carrito);
    await this.carritoService.actualizarTotalEnCarrito(0, item.id_carrito);
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
      const paymentData = {
        amount: Math.round(this.total),
        buyOrder: 'ORDEN' + Date.now(),
        sessionId: 'SESION' + Date.now(),
        returnUrl: `${window.location.origin}/payment/confirmation`
      };

      this.pagoService.initiatePayment(paymentData).subscribe({
        next: (response) => {
          loading.dismiss();
          if (response?.url && response?.token) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = response.url;

            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = 'token_ws';
            tokenInput.value = response.token;

            form.appendChild(tokenInput);
            document.body.appendChild(form);
            form.submit();
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
}







