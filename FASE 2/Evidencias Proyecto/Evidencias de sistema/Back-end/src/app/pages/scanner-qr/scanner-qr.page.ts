import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';
import { LoadingController, AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-scanner-qr',
  templateUrl: './scanner-qr.page.html',
  styleUrls: ['./scanner-qr.page.scss'],
})
export class ScannerQrPage implements OnInit {
  datosUser: any;
  isScanned = true;
  scanResult: string | null = null;

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
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

      // Validación: asegurarse de que el resultado es un número
      if (!/^\d+$/.test(code)) {
        this.showAlert("Código no válido", "El QR escaneado no pertenece a un voucher, intentalo nuevamente.");
        return;
      }

      this.scanResult = code;
      const loading = await this.loadingController.create();
      await loading.present();

      // Muestra el modal si el código es válido
      this.isScanned = true;
      await loading.dismiss();
    } catch (e) {
      console.error("Error al escanear el código QR:", e);
    }
  }

  async showAlert(header: string, message: string) {
    const alert = document.createElement('ion-alert');
    alert.header = header;
    alert.message = message;
    alert.buttons = ['OK'];
    document.body.appendChild(alert);
    await alert.present();
  }
  
}
