import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  async agregarCategoria(categoriaData: any) {
    try {
      const { data, error } = await this.supabase
        .from('categoria')
        .insert(categoriaData)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error agregando la categoría: ', error);
      throw error;
    }
  }

  async obtenerCategorias() {
    const { data, error } = await this.supabase
      .from('categoria')
      .select('*');

    if (error) throw error;
    return data
  }

  async actualizarCategoria(id: number, nombre: string, descripcion: string) {
    const { data, error } = await this.supabase
      .from('categoria')
      .update({ nombre, descripcion })
      .eq('id_categoria', id)
      .single();

    if (error) throw error;
    return data;
  }

  async eliminarCategoria(id: number) {
    const { data, error } = await this.supabase
      .from('categoria')
      .delete()
      .eq('id_categoria', id);

    if (error) throw error;
    return data;
  }
 
}
