import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';


@Component({
  selector: 'app-agregar-productos',
  templateUrl: './agregar-productos.page.html',
  styleUrls: ['./agregar-productos.page.scss'],
})
export class AgregarProductosPage implements OnInit {

  productoForm!: FormGroup;
  categorias: any[] = [];
  currentYear: number = new Date().getFullYear();

  productoEscaneado: any;
  tipoFuncion: Function = this.agregar_producto;
  id_producto: any;
  scanResult: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {}

  ngOnInit() {
    this.initForm();
    this.cargarCategorias();
  }

  initForm() {
    this.productoForm = this.formBuilder.group({
      codigo_barras: ['', [Validators.required, Validators.pattern('^[0-9]{8,13}$')]],
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      marca: ['', [Validators.required, Validators.maxLength(50)]],
      annio: ['', [Validators.required, Validators.min(1990), Validators.max(this.currentYear)]],
      precio: ['', [Validators.required, Validators.min(0)]],
      id_categoria: [null, Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  async cargarCategorias() {
    try {
      this.categorias = await this.categoriaService.obtenerCategorias();
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      this.showAlert('Error', 'No se pudieron cargar las categorías.');
    }
  }

  async agregar_producto() {
    if (this.productoForm.valid) {
      try {
        await this.productoService.agregarProducto(this.productoForm.value);
        this.showAlert('Éxito', 'Producto agregado correctamente.');
        this.productoForm.reset();
      } catch (error) {
        console.error('Error agregando el producto:', error);
        this.showAlert('Error', 'No se pudo agregar el producto.');
      }
    } else {
      this.showAlert('Error de validación', 'Por favor, corrija los errores en el formulario.');
    }
  }

  async editar_producto() {
    if (this.productoForm.valid) {
      try {
        const codigo_barras = this.productoForm.value.codigo_barras;
        const nombre = this.productoForm.value.nombre;
        const marca = this.productoForm.value.marca;
        const annio = this.productoForm.value.annio;
        const precio = this.productoForm.value.precio;
        const id_categoria = this.productoForm.value.id_categoria;
        const descripcion = this.productoForm.value.descripcion;
        await this.productoService.editarProducto(this.id_producto, nombre, marca, annio, precio, id_categoria, descripcion);
        this.showAlert('Éxito', 'Producto editado correctamente.');
        this.productoForm.reset();
      } catch (error) {
        console.error('Error editando el producto:', error);
        this.showAlert('Error', 'No se pudo editar el producto.');
      }
    } else {
      this.showAlert('Error de validación', 'Por favor, corrija los errores en el formulario.');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  get f() { return this.productoForm.controls; }


  //En caso de que se quiera escanear

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
      if (this.productoEscaneado === null) {
        this.productoForm.patchValue({
          codigo_barras: this.scanResult
        })
        await loading.dismiss()
      } else {
        console.log("4")
        this.showAlert('Este producto ya existe', 'Se han rellenado los campos automáticamente por si lo deseas editar')
        this.tipoFuncion = this.editar_producto;
        this.id_producto = this.productoEscaneado.id_producto
        this.productoForm.patchValue({
          codigo_barras: this.productoEscaneado.codigo_barras,
          nombre: this.productoEscaneado.nombre,
          marca: this.productoEscaneado.marca,
          annio: this.productoEscaneado.annio,
          precio: this.productoEscaneado.precio,
          id_categoria: this.productoEscaneado.id_categoria,
          descripcion: this.productoEscaneado.descripcion,
        })
        await loading.dismiss()
      }
    } catch (e) {
      console.error("Error al escanear el código de barras:", e);
    }
  }


}