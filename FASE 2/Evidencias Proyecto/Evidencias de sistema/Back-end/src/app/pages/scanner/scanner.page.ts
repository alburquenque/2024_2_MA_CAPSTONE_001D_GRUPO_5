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
  datosUser : any;
  scanActive = false;
  scanResult: string | null = null;
  productos: any[] = [];
  productoEscaneado: any
  isScanned = false;
  cantidad: number = 1;
  carritoID: any



  constructor(private authService: AuthService, 
              private productoService : ProductoService,
              private carritoService: CarritoService,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private router: Router) {}
              
async ngOnInit() {
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
      this.carritoID = await this.authService.getCarrito(this.datosUser.id_usuario)
      console.log('Datos que se agregan al carrito', this.productoEscaneado.precio, this.cantidad, 
        this.productoEscaneado.precio, this.productoEscaneado.id_producto, this.carritoID, this.datosUser.id_usuario )
      
      console.log("Precio unitario: ", this.productoEscaneado.precio)
      console.log("Cantidad: ", this.cantidad)
      const total_producto = this.productoEscaneado.precio * this.cantidad
      console.log("total: ", total_producto)
      await this.carritoService.agregarProducto(this.productoEscaneado.precio, this.cantidad, 
      total_producto, this.productoEscaneado.id_producto, this.carritoID, this.datosUser.id_usuario );
      console.log("cantidad: ",this.cantidad)
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


  //para la cantidad

  restarCantidad() {
    if (this.cantidad > 1) {
      this.cantidad= this.cantidad-1;
    }
  }

  incrementarCantidad() {
    this.cantidad= this.cantidad+1;
  }




  }






