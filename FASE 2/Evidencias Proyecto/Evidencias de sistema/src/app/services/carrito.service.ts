import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private supabase: SupabaseClient;

  constructor(private authService:AuthService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
   }

   //Aqui se van a agregar los productos que se vayan agregando a los carritos
   async agregarProducto(precio_unitario: any, cantidad: any, total: any, id_producto:any, id_carrito:any, userId:any) {
    try {
      const carrito= await this.authService.getCarrito(userId)
      console.log("estoy aca 2")
      console.log("carrito: ",carrito)
      if (!carrito || carrito === null) {
        console.log('El carrito está vacío');
        try {
          const { data, error } = await this.supabase
            .from('carrito')
            .insert({
              estado:'Activo',
              cantidad: 1,
              total,
              id_usuario:userId
            });
    
          if (error) console.log("error: ",error);
          console.log("estoy aca 3")
        } catch (error) {
          console.error('Error creando el carrito: ', error);
          throw error;
        }
        
      }
      try{
        const carrito2 = await this.authService.getCarrito(userId);
        const id_carrito2=carrito2.id_carrito
        const { data, error } = await this.supabase
        .from('ref_carrito')
        .insert({
        precio_unitario,
        cantidad,
        total,
        id_producto,
        id_carrito:id_carrito2,
        })

        if (error) console.log("error: ",error);
        
        console.log("Estoy aca 4")
        return carrito;
      }
      catch (error) {
        console.log("hubo un error: ", error)
      }

    } catch (error) {
      console.error('Error agregando el producto: ', error);
      throw error;
    }
  }



}
