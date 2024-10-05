import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-agregar-productos',
  templateUrl: './agregar-productos.page.html',
  styleUrls: ['./agregar-productos.page.scss'],
})
export class AgregarProductosPage implements OnInit {

  productoForm!: FormGroup;
  categorias: any[] = [];
  currentYear: number = new Date().getFullYear();

  constructor(
    private formBuilder: FormBuilder,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private alertController: AlertController
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
      id_categoria: [null, Validators.required]
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

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  get f() { return this.productoForm.controls; }
}