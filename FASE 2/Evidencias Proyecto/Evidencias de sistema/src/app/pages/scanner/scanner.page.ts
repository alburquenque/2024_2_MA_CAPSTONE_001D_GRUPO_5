import { Component, OnInit, ViewChild  } from '@angular/core';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';
import { User } from '@supabase/supabase-js';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {
  nombreUser: string = '';
  scanActive = false;
  scanResult: string | null = null;
  productos: any[] = [];
  name: any;
  description:any;
  price:any;
  brand: any;
  categoryTemp:any;
  annioProduct: any;
  isScanned = false;



  constructor(private authService: AuthService, private productoService : ProductoService) {}

  ngOnInit() {
    this.cargarProductos();
    this.authService.getCurrentUser().subscribe((user: User | boolean | null) => {
      if (user && typeof user !== 'boolean') {
        this.authService.getUserDetails(user.id).subscribe(userDetails => {
          console.log('Detalles del usuario:', userDetails); // Muestra todos los detalles del usuario
          // Aquí puedes guardar los detalles en una propiedad del componente
          this.nombreUser = userDetails.data.nombre;
        });
      }
    });
  }

  async cargarProductos() {
    try {
      this.productos = await this.productoService.obtenerProductos();
      console.log('Productos cargados', this.productos)
    } catch (error) {
      console.error('Error obteniendo los datos:', error);
    }
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
      const productoEscaneado = this.productos.find(prod => prod.codigo_barras === this.scanResult);
  
      if (productoEscaneado) {
        this.name = productoEscaneado.nombre;
        this.description = productoEscaneado.descripcion;
        this.price = productoEscaneado.precio;
        this.categoryTemp = productoEscaneado.id_categoria;
        this.brand = productoEscaneado.marca;
        this.annioProduct = productoEscaneado.annio;
        console.log("Producto escaneado:", productoEscaneado.nombre);
        this.isScanned = true;
      } else {
        console.log("Producto no encontrado");
      }
    } catch (e) {
      console.error("Error al escanear el código de barras:", e);
    }
  }



  }






