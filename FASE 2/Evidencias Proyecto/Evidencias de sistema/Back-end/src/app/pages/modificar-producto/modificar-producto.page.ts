import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modificar-producto',
  templateUrl: './modificar-producto.page.html',
  styleUrls: ['./modificar-producto.page.scss'],
})
export class ModificarProductoPage implements OnInit {
  productoForm!: FormGroup;
  categorias: any[] = [];
  producto: any = null;
  imageFile: File | null = null;
  id_producto!: number;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.productoForm = new FormGroup({
      codigo_barras: new FormControl('', Validators.required),
      nombre: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      id_categoria: new FormControl(null, Validators.required),
      marca: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      annio: new FormControl('', [Validators.required, Validators.min(1990), Validators.max(new Date().getFullYear())]),
      precio: new FormControl('', [Validators.required, Validators.min(0)]),
      descripcion: new FormControl('', [Validators.required]),
    });
  }

  get f() {
    return this.productoForm?.controls;
  }
  ngOnInit() {
    this.id_producto = this.route.snapshot.params['id'];
    this.cargarCategorias();
    this.cargarProducto();
  }

  async cargarCategorias() {
    try {
      this.categorias = await this.categoriaService.obtenerCategorias();
    } catch (error) {
      console.error('Error cargando categorías:', error);
      this.showAlert('Error', 'No se pudieron cargar las categorías.');
    }
  }

  async cargarProducto() {
    try {
      this.producto = await this.productoService.obtenerProductoPorId(this.id_producto);
      if (!this.producto) {
        this.showAlert('Error', 'No se encontró el producto.');
        this.router.navigate(['/lista-productos']);
      } else {
        this.productoForm.patchValue({
          codigo_barras: this.producto.codigo_barras || '',
          nombre: this.producto.nombre || '',
          marca: this.producto.marca || '',
          annio: this.producto.annio || 1990, 
          precio: this.producto.precio || 0, 
          id_categoria: this.producto.id_categoria || null,
          descripcion: this.producto.descripcion || '',
        });
      }
    } catch (error) {
      console.error('Error cargando producto:', error);
      this.showAlert('Error', 'No se pudo cargar el producto.');
      this.router.navigate(['/lista-productos']);
    }
  }


  onFileChange(event: Event) {
    const fileInput = (event.target as HTMLInputElement).files;
    if (fileInput && fileInput.length > 0) {
      this.imageFile = fileInput[0];
    }
  }

  async editar_producto() {
    if (!this.productoForm.valid) {
      Object.keys(this.productoForm.controls).forEach((field) => {
        const control = this.productoForm.get(field);
        control?.markAsTouched(); 
      });
      this.showAlert('Error de validación', 'Por favor, corrija los errores en el formulario.');
      return;
    }
  
    try {
      const loading = await this.loadingController.create({ message: 'Guardando cambios...' });
      await loading.present();
  
      const formData = this.productoForm.value;
      let imagen = this.producto.imagen;
  
      if (this.imageFile) {
        imagen = await this.productoService.subirImagenProducto(this.imageFile);
      }
  
      await this.productoService.editarProducto(
        this.id_producto,
        formData.nombre,
        formData.marca,
        formData.annio,
        formData.precio,
        formData.id_categoria,
        formData.descripcion
      );
  
      await loading.dismiss();
      this.showAlert('Éxito', 'Producto modificado correctamente.');
      this.router.navigate(['/listar-productos']);
    } catch (error) {
      console.error('Error editando producto:', error);
      this.showAlert('Error', 'No se pudo editar el producto.');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}



