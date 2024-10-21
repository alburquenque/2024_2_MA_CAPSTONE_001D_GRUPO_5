import { Component, OnInit, ViewChild  } from '@angular/core';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';
import { User } from '@supabase/supabase-js';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { LoadingController, AlertController } from '@ionic/angular'
import { Router } from '@angular/router'

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {
  nombreUser: string = '';
  id_user: string = '';
  scanActive = false;
  scanResult: string | null = null;
  productos: any[] = [];
  productoEscaneado: any
  isScanned = false;



  constructor(private authService: AuthService, 
              private productoService : ProductoService,
              private carritoService: CarritoService,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: User | boolean | null) => {
      if (user && typeof user !== 'boolean') {
        this.authService.getUserDetails(user.id).subscribe(userDetails => {
          // Aquí puedes guardar los detalles en una propiedad del componente
          this.nombreUser = userDetails.data.nombre;
          this.id_user = userDetails.data.id_usuario;
        });
      }
    });
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

  async scanBarcode() {
    try {
      const code = await this.startScan();
      if (!code) {
        console.log("No se pudo escanear el producto");
        return;
      }
      this.scanResult = code;
      const loading = await this.loadingController.create()
      await loading.present()
      this.productoEscaneado = await this.productoService.obtenerProductoEspecifico(this.scanResult);
      console.log("producto: ", this.productoEscaneado)
  
      if (this.productoEscaneado === null) {
        await loading.dismiss()
        this.showAlert('Producto no encontrado', 'Intenta escanear el producto nuevamente')
      } else {
        await loading.dismiss()
        this.isScanned = true;
      }
    } catch (e) {
      console.error("Error al escanear el código de barras:", e);
    }
  }

  async agregarProducto() {
    
    try {
      const loading = await this.loadingController.create()
      await loading.present()
      await this.carritoService.agregarProducto(this.productoEscaneado.precio, 1, 
      this.productoEscaneado.precio, this.productoEscaneado.id_producto, 4, this.id_user );
      await this.cerrarProducto();
      await loading.dismiss()

      await this.router.navigateByUrl('/carrito', { replaceUrl: true });

    } catch (error) {
      console.error('No se pudo agregar el producto porque: ', error);
    }
  }


  async cerrarProducto(){
    this.isScanned = false;
  }

  async showAlert(title:string, msg:any) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    })
    await alert.present()
  }



  }






