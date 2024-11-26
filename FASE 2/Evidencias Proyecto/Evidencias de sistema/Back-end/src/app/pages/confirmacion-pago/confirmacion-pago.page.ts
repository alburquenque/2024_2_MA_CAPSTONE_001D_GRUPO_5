import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarritoService } from 'src/app/services/carrito.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-confirmacion-pago',
  templateUrl: './confirmacion-pago.page.html',
  styleUrls: ['./confirmacion-pago.page.scss'],
})
export class ConfirmacionPagoPage implements OnInit {
  paymentStatus: string = '';
  token: string = '';
  loading: any;
  qrCodeData: string | null = null; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carritoService: CarritoService,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.presentLoading();
    
    this.route.queryParams.subscribe(async params => {
      this.token = params['token_ws'];
      
      if (this.token) {
        try {
          const userId = await this.authService.getCurrentUserId();
          const carrito = await this.authService.getCarrito(userId);
          
          if (!carrito) {
            throw new Error('No se encontró el carrito');
          }

          const compraData = {
            estado: 'Pendiente',
            cantidad: carrito.cantidad,
            total: carrito.total,
            id_usuario: userId, 
          };

          const compraId = await this.carritoService.guardarCompra(compraData);

          if (compraId) {
            console.log('Datos del carrito obtenidos:', carrito);
            console.log('Items del carrito:', carrito.items);
            
            for (const item of carrito.items) {
              const total = item.precio_unitario * item.cantidad;
            
              const refCompraData = {
                id_compra: compraId,
                id_producto: item.id_producto,
                precio_unitario: item.precio_unitario,
                cantidad: item.cantidad,
                total: total,
              };

              const voucherData = {
                cantidad: item.cantidad, 
                total: total,
                estado: 'Pendiente', 
                id_compra: compraId 
              };
            
              console.log('Datos a guardar en ref_compra:', refCompraData);
            
              await this.carritoService.guardarRefCompra(refCompraData);
              await this.carritoService.guardarVoucher(voucherData);
            
            }

            this.qrCodeData = await this.generateQRCode(compraId.toString());
          }

          this.paymentStatus = 'success';
          await this.dismissLoading();
          await this.mostrarMensajeExito();
          await this.carritoService.limpiarCarrito(userId);

        } catch (error) {
          console.error('Error al procesar la confirmación:', error);
          this.paymentStatus = 'error';
          await this.dismissLoading();
          await this.mostrarMensajeError();
        }
      } else {
        this.paymentStatus = 'cancelled';
        await this.dismissLoading();
        await this.mostrarMensajeCancelado();
      }
    });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Procesando resultado...',
      spinner: 'circular',
    });
    await this.loading.present();
  }

  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }

  async mostrarMensajeExito() {
    const alert = await this.alertController.create({
      header: 'Pago Registrado',
      message: 'Tu pago ha sido registrado correctamente. El estado actual es "no completado" hasta que se confirme la transacción por medio de voucher.',
      buttons: [
        {
          text: 'OK',
        }
      ]
    });
    await alert.present();
  }

  async mostrarMensajeError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Hubo un error al procesar el pago. Por favor, intenta nuevamente.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/carrito']);
          }
        }
      ]
    });
    await alert.present();
  }

  async mostrarMensajeCancelado() {
    const alert = await this.alertController.create({
      header: 'Pago Cancelado',
      message: 'El proceso de pago ha sido cancelado.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/carrito']);
          }
        }
      ]
    });
    await alert.present();
  }

  async generateQRCode(text: string): Promise<string> {
    try {
      return await QRCode.toDataURL(text, {
        errorCorrectionLevel: 'H',
        width: 200,
        margin: 2
      });
    } catch (error) {
      console.error('Error al generar QR:', error);
      return '';
    }
  }
  

}
