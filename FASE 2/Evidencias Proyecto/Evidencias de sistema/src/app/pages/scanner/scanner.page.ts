import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef  } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit, AfterViewInit {
  @ViewChild(ZXingScannerComponent) scanner!: ZXingScannerComponent;
  allowedFormats = [BarcodeFormat.EAN_13];
  availableDevices: MediaDeviceInfo[] = [];
  scanError: string | null = null;
  scanResult: string | null = null;

  

  constructor(private cdr: ChangeDetectorRef,
              private platform: Platform
  ) {}

  ngOnInit() {
    console.log(this.scanner?.camerasFound)
    this.checkAndRequestCameraPermission()
  }

  ngAfterViewInit() {

    this.scanner.scanError.subscribe((error) => {
      // Almacenar el mensaje de error en la variable scanError
      this.scanError = `Error de escaneo: ${error.message}`;
      console.error('Scan error:', error);

      this.cdr.detectChanges();
    });

    // Obtenemos las cámaras disponibles
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.availableDevices = devices;
      console.log('Dispositivos encontrados:', this.availableDevices);

      // Si hay cámaras disponibles, seleccionamos la primera
      if (this.availableDevices.length > 0) {
        const selectedDevice = this.availableDevices[0]; // Selecciona la primera cámara

        // Asigna la cámara seleccionada al scanner
        this.scanner.device=selectedDevice; // Cambia al dispositivo seleccionado
      }
    });

    this.scanner.camerasNotFound.subscribe(() => {
      console.error('No se encontraron cámaras.');
    });

}

  onScanSuccess(result: string) {
    this.scanResult = result;
    console.log('Código escaneado:', result);  // Ver en la consola
  }

  async checkAndRequestCameraPermission() {
    if (this.platform.is('android')) {
      const cameraPermission = await Camera.requestPermissions();
      
      if (cameraPermission.camera !== 'granted') {
        console.log('Permiso de cámara no concedido');
      } else {
        console.log('Permiso de cámara concedido');
      }
    }
  }

}
