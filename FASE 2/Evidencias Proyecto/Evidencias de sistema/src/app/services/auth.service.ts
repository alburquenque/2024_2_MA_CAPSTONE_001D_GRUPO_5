import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async register(email: string, password: string, nombre: string, apellido: string) {
    try {

      const { data, error } = await this.supabaseService.getSupabase().auth.signUp({
        email,
        password
      });
      if (data?.user) {
        const { error: profileError } = await this.supabaseService.getSupabase()
          .from('usuario')
          .insert({
            nombre,
            apellido,
            email,
            password, 
            id_rol: 1, // Cliente por defecto. 2 es admin, y 3 es superadmin. Esos se crean de la BD.
            id_categoriacliente: 1 // Sin categoria al registrarse
          });

        if (profileError) {
          console.error('Error al insertar en la tabla usuario:', profileError);
          throw profileError;
        }
      }

      return data;
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }
}
