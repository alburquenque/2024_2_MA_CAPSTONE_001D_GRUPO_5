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
    //Aqui primero se verifica si el usuario tiene carrito, en caso de no tener se crea uno para tener id
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
      //Aqui termina la creacion del carrito en caso de no tenerlo.

      //Luego el siguiente try insertamos datos en la tabla "ref_carrito" que es donde obtendremos la informacion para mostrarla en el carrito.
      try{

        const carrito2 = await this.authService.getCarrito(userId); //Obtenemos los datos del carrito filtrando por la id del usuario
        const id_carrito2=carrito2.id_carrito //Aqui solo almacenamos la id del carrito de ref_carrito, ya que con el obtendremos la informacion hacia las demas tablas
        const refcarrito = await this.obtenerDataRefCarrito(id_carrito2);
        console.log('Estoy aca en 3.5 para ver lo que obtenemos de id_carrito2: ',id_carrito2);
        //Para no escanear de nuevo el id del carrito de Kevin es: 6
        console.log('Estoy aca en 3.8 para ver lo que obtengo de refcarrito: ',refcarrito)
        const productoExistente = await refcarrito?.find(item => item.id_producto === id_producto)
        if(productoExistente){
          const nuevaCantidad = productoExistente.cantidad + cantidad;
          await this.actualizarCantidadProducto(nuevaCantidad, productoExistente.id_refcarrito);
          await this.actualizarCantidadEnCarrito(nuevaCantidad, id_carrito2);
          await this.actualizarTotalEnCarrito(nuevaCantidad, id_carrito2, productoExistente.precio_unitario);
          await this.actualizarTotalEnRef(nuevaCantidad, productoExistente.id_refcarrito, productoExistente.precio_unitario)

        }
        else{
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
      }
      catch (error) {
        console.log("hubo un error: ", error)
      }

    } catch (error) {
      console.error('Error agregando el producto: ', error);
      throw error;
    }
  }

  async obtenerDataRefCarrito(idCarrito: any) {
    try {
      const { data, error } = await this.supabase
        .from('ref_carrito')
        .select('*')
        .eq('id_carrito', idCarrito);
  
      if (error) {
        console.log('Hubo un error obteniendo los datos', error);
        return null;
      }
  
      return data;
    } catch (error) {
      console.error('Error obteniendo los productos del carrito: ', error);
      throw error;
    }
  }

  async actualizarCantidadProducto(nuevaCantidad: any, id_refcarrito: any) {
    try {
      const { data, error } = await this.supabase
        .from('ref_carrito')
        .update({ cantidad: nuevaCantidad })
        .eq('id_refcarrito', id_refcarrito);
  
      if (error) {
        console.error("Error actualizando la cantidad: ", error);
        throw error;
      }
  
      console.log('Cantidad actualizada correctamente', data);
    } catch (error) {
      console.error('Error actualizando la cantidad del producto: ', error);
      throw error;
    }
  }

  async actualizarCantidadEnCarrito(nuevaCantidad: any, id_carrito: any) {
    try {
      const { data, error } = await this.supabase
        .from('carrito')
        .update({ 
          cantidad: nuevaCantidad,
         })
        .eq('id_carrito', id_carrito);
  
      if (error) {
        console.error("Error actualizando la cantidad: ", error);
        throw error;
      }
  
      console.log('Cantidad actualizada correctamente', data);
    } catch (error) {
      console.error('Error actualizando la cantidad del producto: ', error);
      throw error;
    }
  }

  async actualizarTotalEnCarrito(nuevaCantidad: any, id_carrito: any, precio: any) {
    try {
      const { data, error } = await this.supabase
        .from('carrito')
        .update({ 
          total: nuevaCantidad*precio
         })
        .eq('id_carrito', id_carrito);
  
      if (error) {
        console.error("Error actualizando la cantidad: ", error);
        throw error;
      }
  
      console.log('Cantidad actualizada correctamente', data);
    } catch (error) {
      console.error('Error actualizando la cantidad del producto: ', error);
      throw error;
    }
  }

  async actualizarTotalEnRef(nuevaCantidad: any, idref_carrito: any, precio: any) {
    try {
      const { data, error } = await this.supabase
        .from('ref_carrito')
        .update({ 
          total: precio*nuevaCantidad
         })
        .eq('id_refcarrito', idref_carrito);
  
      if (error) {
        console.error("Error actualizando la cantidad: ", error);
        throw error;
      }
  
      console.log('Cantidad actualizada correctamente', data);
    } catch (error) {
      console.error('Error actualizando la cantidad del producto: ', error);
      throw error;
    }
  }
  



}
