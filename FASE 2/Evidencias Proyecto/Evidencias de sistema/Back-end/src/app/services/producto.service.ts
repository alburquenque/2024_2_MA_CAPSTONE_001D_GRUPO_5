import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async subirImagenProducto(file: File): Promise<string | null> {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await this.supabase
        .storage
        .from('productos-bucket')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = this.supabase
        .storage
        .from('productos-bucket')
        .getPublicUrl(fileName);

      return urlData?.publicUrl || null; // Return publicUrl correctly
    } catch (error) {
      console.error('Error subiendo imagen: ', error);
      return null;
    }
  }



  async agregarProducto(productoData: any, imageFile: File) {
    try {
      const imageUrl = await this.subirImagenProducto(imageFile);
      if (!imageUrl) throw new Error('Error uploading image');

      productoData.imagen = imageUrl;

      const { data, error } = await this.supabase
        .from('producto')
        .insert(productoData)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error agregando el producto: ', error);
      throw error;
    }
  }


  async editarProducto(id_producto:any, nombre:any, marca:any, annio:any, precio:any, id_categoria:any, descripcion:any) {
    try {
      const { data, error } = await this.supabase
        .from('producto')
        .update({ id_producto, nombre, marca, annio, precio, id_categoria, descripcion })
        .eq('id_producto', id_producto)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error editando el producto: ', error);
      throw error;
    }
  }


  async obtenerProductos() {
    try {
      const { data, error } = await this.supabase
        .from('producto')
        .select('*');

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error obteniendo productos: ', error);
      throw error;
    }
  }

  async eliminarProducto(id: number) {
    const { data, error } = await this.supabase
      .from('producto')
      .delete()
      .eq('id_producto', id);

    if (error) throw error;
    return data;
  }


  async obtenerProductoEspecifico(codigo_barras: any) {
    try {
      const { data, error } = await this.supabase
        .from('producto')
        .select(`*,
                  categoria(
                  nombre)`)
        .eq('codigo_barras', codigo_barras)
        .single();

      if (error){
        return null;
      } 
      return data;
    } catch (error) {
      console.error('Error obteniendo producto: ', error);
      return null;
    }
  }
  




}
  

  



