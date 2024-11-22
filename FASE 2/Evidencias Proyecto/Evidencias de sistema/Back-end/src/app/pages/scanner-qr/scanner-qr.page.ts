import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { ProductoService } from 'src/app/services/producto.service';


@Component({
  selector: 'app-scanner-qr',
  templateUrl: './scanner-qr.page.html',
  styleUrls: ['./scanner-qr.page.scss'],
})
export class ScannerQrPage implements OnInit {
  datosUser: any;
  isScanned = false;
  scanResult: string | null = null;
  idProductos: any[] = [];
  productos: any[] = [];
  totalCompra: any;
  idCompraVoucher: any;

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private productoService: ProductoService,
    private alertController : AlertController
  ) {}

  ngOnInit() {
    this.datosUser = this.authService.getLocalUserData();
    console.log("Datos del usuario: ", this.datosUser);
  }

  async startScan(val?: number) {
    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: val || 17,
        cameraDirection: 1,
      });
      console.log(result);
      this.scanResult = result.ScanResult
      return this.scanResult;
    } catch (e) {
      throw e;
    }
  }

  async scanQRCode() {
    try {
      const code = await this.startScan();
      if (!code) {
        console.log("No se pudo escanear el QR");
        return;
      }
  
      // Validar que el QR pertenece a una compra
      const verificationQR = await this.productoService.obtenerCompraDelVoucher(parseInt(code));
      if (!verificationQR) {
        this.showAlert("Código no válido", "El QR escaneado no pertenece a un voucher, intentalo nuevamente.");
        return;
      }
  
      // Guardar el total de la compra en la variable
      this.totalCompra = verificationQR[0].total; // Asegúrate de que 'total' sea el campo correcto
      this.idCompraVoucher = verificationQR[0].id_compra;
      console.log(' id compra', this.idCompraVoucher)
      console.log('Total de la compra:', this.totalCompra);
  
      this.scanResult = code; // Guarda el resultado del QR escaneado
      const loading = await this.loadingController.create();
      await loading.present();
  
      // Muestra el modal si el código es válido
      this.isScanned = true;
  
      // Obtén los IDs de los productos de la compra
      const idProductos = await this.productoService.obtenerProductosPorCompra(parseInt(this.scanResult));
      console.log("IDs de productos obtenidos:", idProductos);
  
      // Para cada ID de producto, obtener los detalles específicos
      this.productos = [];
      for (const item of idProductos) {
        const producto = await this.productoService.obtenerProductoPorId(item.id_producto);
        this.productos.push(producto);
      }
  
      console.log("Detalles de productos obtenidos:", this.productos);
  
      await loading.dismiss();
    } catch (e) {
      console.error("Error al escanear el código QR:", e);
      this.showAlert("Error", "Ocurrió un error al procesar el código QR.");
    }
  }

  formatearPesos(valor: number): string {
    return '$' + valor.toLocaleString('es-CL');
  }
  
  

  async showAlert(header: string, message: string) {
    const alert = document.createElement('ion-alert');
    alert.header = header;
    alert.message = message;
    alert.buttons = ['OK'];
    document.body.appendChild(alert);
    await alert.present();
  }

  async obtenerProductos(idCompra: number) {
    try {
      const productos = await this.productoService.obtenerProductosPorCompra(idCompra);
      console.log('Productos obtenidos:', productos);
  
      // Aquí puedes asignar los productos a una variable para mostrarlos en tu HTML
      this.idProductos = productos;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      this.showAlert('Error', 'No se pudieron obtener los productos de esta compra.');
    }
  }

  async validarVoucherConConfirmacion(idCompra: number) {
    try {
      // Verificar el estado actual de la compra y el voucher
      const compra = await this.productoService.obtenerEstadoCompra(idCompra);
      const voucher = await this.productoService.obtenerEstadoVoucher(idCompra);
  
      // Si ambos ya están validados, mostrar un mensaje informativo
      if (compra?.estado === 'Validado' && voucher?.estado === 'Validado') {
        console.log('El voucher y la compra ya están validados.');
        await this.mostrarMensajeYaValidado();
        return;
      }
  
      // Mostrar la confirmación al usuario si no están validados
      const alert = await this.alertController.create({
        header: 'Confirmar validación',
        message: '¿Estás seguro de que deseas validar este voucher?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Validación cancelada por el usuario.');
            },
          },
          {
            text: 'Confirmar',
            handler: async () => {
              try {
                // Validar el voucher y actualizar estados
                const compraActualizada = await this.productoService.modificarEstado(idCompra);
                const voucherActualizado = await this.productoService.modificarEstadoVoucher(idCompra);
  
                if (compraActualizada && voucherActualizado) {
                  console.log('El voucher y la compra se han validado correctamente.');
                  await this.mostrarMensajeExito();
                } else {
                  console.error('No se pudo actualizar uno de los estados.');
                  await this.mostrarMensajeError();
                }
              } catch (error) {
                console.error('Error durante la validación del voucher:', error);
                await this.mostrarMensajeError();
              }
            },
          },
        ],
      });
  
      await alert.present();
    } catch (error) {
      console.error('Error al verificar el estado del voucher y la compra:', error);
      await this.mostrarMensajeError();
    }
  }
  

  async mostrarMensajeExito() {
    const alert = await this.alertController.create({
      header: 'Validación Exitosa',
      message: 'El voucher y la compra se han validado correctamente.',
      buttons: ['OK'],
    });
    await alert.present();
  }
  
  async mostrarMensajeError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Hubo un problema al validar el voucher. Por favor, intenta nuevamente.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  validarVoucher(){
    this.validarVoucherConConfirmacion(this.idCompraVoucher)
  }

  async mostrarMensajeYaValidado() {
    const alert = await this.alertController.create({
      header: 'Información',
      message: 'Este voucher y su compra ya están validados.',
      buttons: ['OK'],
    });
    await alert.present();
  }
  
  

  

  
  
}
