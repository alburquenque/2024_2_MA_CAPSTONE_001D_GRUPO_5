import { Component, OnInit, ViewChild  } from '@angular/core';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';
import { User } from '@supabase/supabase-js';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';
import { CarritoService } from 'src/app/services/carrito.service';

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
              private carritoService: CarritoService) {}

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
      this.productoEscaneado = await this.productoService.obtenerProductoEspecifico(this.scanResult);
      console.log("producto: ", this.productoEscaneado)
  
      if (this.productoEscaneado === null) {
        console.log("Producto no encontrado");
      } else {
        this.isScanned = true;
      }
    } catch (e) {
      console.error("Error al escanear el código de barras:", e);
    }
  }

  async agregarProducto() {
    try {
      this.carritoService.agregarProducto(this.productoEscaneado.precio, 1, 
        this.productoEscaneado.precio, this.productoEscaneado.id_producto, 4, this.id_user );
        console.log("si llegue aca")

    } catch (error) {
      console.error('No se pudo agregar el producto porque: ', error);
    }
  }



  }






