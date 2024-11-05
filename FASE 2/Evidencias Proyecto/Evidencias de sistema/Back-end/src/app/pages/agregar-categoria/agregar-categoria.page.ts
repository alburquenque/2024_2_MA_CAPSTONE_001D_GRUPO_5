import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaService } from 'src/app/services/categoria.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-agregar-categoria',
  templateUrl: './agregar-categoria.page.html',
  styleUrls: ['./agregar-categoria.page.scss'],
})
export class AgregarCategoriaPage  {
  categoriaForm!: FormGroup;

  constructor(private categoriaService: CategoriaService, private formBuilder: FormBuilder, private alertController: AlertController, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.categoriaForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      descripcion: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }




  async agregar_categoria() {
    if (this.categoriaForm.valid) {
      try {
        await this.categoriaService.agregarCategoria(this.categoriaForm.value);
        this.showAlert('Éxito', 'Categoría agregada correctamente.');
        this.categoriaForm.reset();
        this.router.navigate(['/listar-categorias']); 
      } catch (error) {
        console.error('Error agregando la categoría:', error);
        this.showAlert('Error', 'No se pudo agregar la categoría.');
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

  get f() { return this.categoriaForm.controls; }

}
