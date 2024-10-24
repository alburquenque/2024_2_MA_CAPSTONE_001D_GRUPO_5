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

  async agregarProducto(productoData: any) {
    try {
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
        .select('*')
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
  

  



