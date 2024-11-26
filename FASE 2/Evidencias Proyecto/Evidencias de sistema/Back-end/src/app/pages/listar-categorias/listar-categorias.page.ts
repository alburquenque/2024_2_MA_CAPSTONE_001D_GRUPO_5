import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CategoriaService } from 'src/app/services/categoria.service';
@Component({
  selector: 'app-listar-categorias',
  templateUrl: './listar-categorias.page.html',
  styleUrls: ['./listar-categorias.page.scss'],
})
export class ListarCategoriasPage implements OnInit {
  todasLasCategorias: any[] = [];

  categorias: any[] = [];
  textoBusqueda = '';
  constructor(private categoriaService: CategoriaService, private alertController: AlertController) {}

  ngOnInit() {
    this.cargarCategorias();
  }

  buscarCategorias(event: any) {
    this.textoBusqueda = event.target.value.toLowerCase().trim();
    
    if (this.textoBusqueda === '') {
      this.categorias = [...this.todasLasCategorias];
      return;
    }
  
    this.categorias = this.todasLasCategorias.filter(categoria => 
      (categoria.nombre?.toLowerCase().includes(this.textoBusqueda))
    );
  }

  async cargarCategorias() {
    try {
      this.todasLasCategorias = await this.categoriaService.obtenerCategorias();
      this.categorias = [...this.todasLasCategorias];     
    } catch (error) {
      console.error('Error obteniendo los datos:', error);
    }   
  }
  

  async eliminarCategoria(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Está seguro de que desea eliminar esta categoría?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.categoriaService.eliminarCategoria(id);
              this.categorias = this.categorias.filter(categoria => categoria.id_categoria !== id);
            } catch (error) {
              console.error('Error eliminando la categoría:', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }


}
