import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private supabase: SupabaseClient;
  
  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  //Método para poder obtener todos las compras efecutadas por un usuario:
  async getCompras(id:any){
    try {
      const { data, error } = await this.supabase
      .from('compra')
      .select(`
        *,
          voucher(*)
      `)
      .eq('id_usuario', id)

      if (error){
        return [];
      } 
      return data;
    } catch (error) {
      console.error('Error obteniendo compras: ', error);
      return [];
    }
  }

  async getCompraEspecifica(id_voucher:any){
    try {
      const { data, error } = await this.supabase
      .from('voucher')
      .select(`
        *,
          compra(*,
            ref_compra(*,
              producto(*)
            )
          )
      `)
      .eq('id_voucher', id_voucher)

      if (error){
        return null;
      } 
      return data;
    } catch (error) {
      console.error('Error obteniendo voucher: ', error);
      return null;
    }
  }
}