import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-listar-productos',
  templateUrl: './listar-productos.page.html',
  styleUrls: ['./listar-productos.page.scss'],
})
export class ListarProductosPage implements OnInit {

  productos: any[] = [];
  categorias: any[] = [];

  constructor(private productoService: ProductoService, private alertController: AlertController) {}

  ngOnInit() {
    this.cargarProductos();
  }

  async cargarProductos() {
    try {
      this.productos = await this.productoService.obtenerProductos();
    } catch (error) {
      console.error('Error obteniendo los datos:', error);
    }
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




  

}
