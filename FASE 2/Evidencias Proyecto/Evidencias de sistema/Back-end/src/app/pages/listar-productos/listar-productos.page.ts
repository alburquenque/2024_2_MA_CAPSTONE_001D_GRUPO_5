import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-listar-productos',
  templateUrl: './listar-productos.page.html',
  styleUrls: ['./listar-productos.page.scss'],
})
export class ListarProductosPage implements OnInit {
  todosLosProductos: any[] = [];
  productos: any[] = [];
  categorias: any[] = [];
  metodoIngreso: 'formulario' | 'csv' = 'formulario';
  textoBusqueda = '';

  constructor(private productoService: ProductoService, private alertController: AlertController, private loadingController: LoadingController, private modalController: ModalController, private router: Router) {}

  ngOnInit() {
    this.cargarProductos();
  }

  buscarProductos(event: any) {
    this.textoBusqueda = event.target.value.toLowerCase().trim();
    
    if (this.textoBusqueda === '') {
      this.productos = [...this.todosLosProductos];
      return;
    }
  
    this.productos = this.todosLosProductos.filter(producto => 
      (producto.nombre?.toLowerCase().includes(this.textoBusqueda) ||
       producto.marca?.toLowerCase().includes(this.textoBusqueda) ||
       producto.codigo_barras.includes(this.textoBusqueda))
    );
  }
  async cargarProductos() {
    try {
      this.todosLosProductos = await this.productoService.obtenerProductos();
      this.productos = [...this.todosLosProductos]; 
    } catch (error) {
      console.error('Error obteniendo los datos:', error);
    }
  }

  editarProducto(id_producto: number) {
    try {
      this.router.navigate(['/modificar-producto', id_producto])
        .then(success => {
          console.log('Navigation successful', success);
        })
        .catch(error => {
          console.error('Navigation error', error);
          this.showNavigationErrorAlert(error);
        });
    } catch (error) {
      console.error('Error during navigation:', error);
      this.showNavigationErrorAlert(error);
    }
  }
  
  // Optional error alert method
  async showNavigationErrorAlert(error: any) {
    const alert = await this.alertController.create({
      header: 'Navigation Error',
      message: `Could not navigate: ${error}`,
      buttons: ['OK']
    });
    await alert.present();
  }

  async eliminarProducto(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Está seguro de que desea eliminar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.productoService.eliminarProducto(id);
              this.productos = this.productos.filter(producto => producto.id_producto !== id);
            } catch (error) {
              console.error('Error eliminando el producto:', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async importarCSV(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const alert = await this.alertController.create({
        header: 'Confirmar importación',
        message: `¿Está seguro de que desea importar los productos desde ${file.name}?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Importar',
            handler: async () => {
              const loading = await this.loadingController.create({
                message: 'Importando productos...',
                spinner: 'circular'
              });
              await loading.present();
              try {
                await this.productoService.importarProductosCSV(file);
                await this.cargarProductos();
                await loading.dismiss();
                this.mostrarMensajeExito();
              } catch (error) {
                console.error('Error en la importación:', error);
                this.mostrarMensajeError();
              }
            }
          }
        ]
      });

      await alert.present();
    } catch (error) {
      console.error('Error procesando el archivo:', error);
      this.mostrarMensajeError();
    }
  }

  private async mostrarMensajeExito() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Los productos se han importado correctamente',
      buttons: ['OK']
    });
    await alert.present();
  }

  private async mostrarMensajeError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Ha ocurrido un error al importar los productos, revise que el esquema del csv cumple con las siguientes especificaciones: codigo_barras,nombre,marca,annio,precio,id_categoria,descripcion, imagen',
      buttons: ['OK']
    });
    await alert.present();
  }




  

}
