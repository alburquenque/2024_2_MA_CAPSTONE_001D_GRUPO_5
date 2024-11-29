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
  voucherEntero: any;

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private productoService: ProductoService,
    private alertController : AlertController
  ) {}

  ngOnInit() {
    this.datosUser = this.authService.getLocalUserData();
    console.log("datos del usuario: ",this.datosUser)
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
       this.voucherEntero = await this.productoService.obtenerVoucherEntero(parseInt(code));
       console.log("Voucher:", this.voucherEntero[0].id_voucher)
       console.log("Compra:", this.voucherEntero[0].compra)
       console.log("productos:",this.voucherEntero[0].compra.ref_compra.map((ref: any) => ref.producto)
      );
      

       
      if (!this.voucherEntero[0].id_voucher) {
        this.showAlert("Código no válido", "El QR escaneado no pertenece a un voucher, intentalo nuevamente.");
        return;
      }
      this.scanResult = code; // Guarda el resultado del QR escaneado
      const loading = await this.loadingController.create();
      await loading.present();
      this.isScanned = true;

      
  
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

  async validarVoucherConConfirmacion() {
    try {

      if (this.voucherEntero[0].estado === 'Completado') {
        console.log('El voucher ya está validado.');
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
                // Validar el voucher y actualizar estados;
                const voucherActualizado = await this.productoService.modificarEstadoVoucher(this.voucherEntero[0].id_voucher);
  
                if (voucherActualizado) {
                  console.log('El voucher ha sido validado correctamente.');
                  await this.mostrarMensajeExito();
                } else {
                  console.error('No se pudo actualizar el estado.');
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
    this.validarVoucherConConfirmacion()
  }

  async mostrarMensajeYaValidado() {
    const alert = await this.alertController.create({
      header: 'Información',
      message: 'Este voucher ya se encuentra validado.',
      buttons: ['OK'],
    });
    await alert.present();
  }
  
  

  

  
  
}
