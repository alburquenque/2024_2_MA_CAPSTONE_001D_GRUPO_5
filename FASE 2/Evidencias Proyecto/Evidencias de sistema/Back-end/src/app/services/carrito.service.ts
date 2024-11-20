import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private supabase: SupabaseClient;
  public promesaItemsCarrito = new BehaviorSubject<any[]>([]);

  constructor(private authService:AuthService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
   }

   get itemsCarrito$(): Observable<any[]> {
    return this.promesaItemsCarrito.asObservable();
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
        const habiaCarrito = 0
        try {
          const { data, error } = await this.supabase
            .from('carrito')
            .insert({
              estado:'Activo',
              cantidad: cantidad,
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

      //Luego el siguiente try insertamos datos en la tabla "ref_carrito" que es donde obtendremos la informacion para mostrarla en el carrito.
      try{

        const carrito2 = await this.authService.getCarrito(userId);
        const id_carrito2=carrito2.id_carrito
        const productoExistente = await this.obtenerProductoRefCarrito(id_producto, id_carrito2);
        //const productoExistente = await refcarrito?.find(item => item.id_producto === id_producto)
        if(productoExistente){
          const nuevaCantidad = productoExistente.cantidad + cantidad;
          const totalCarrito = nuevaCantidad*productoExistente.precio_unitario
          await this.actualizarCantidadProducto(nuevaCantidad, productoExistente.id_refcarrito);
          await this.actualizarCantidadEnCarrito(nuevaCantidad, id_carrito2);
          await this.actualizarTotalEnCarrito(totalCarrito, id_carrito2);
          await this.actualizarTotalEnRef(nuevaCantidad, productoExistente.id_refcarrito, productoExistente.precio_unitario)

        }
        else{
          //En caso de que el producto escaneado sea uno nuevo
          const { data, error } = await this.supabase
          .from('ref_carrito')
          .insert({
          precio_unitario,
          cantidad,
          total,
          id_producto,
          id_carrito:id_carrito2,
          })  
            if(carrito){
            //Cambiar el total y cantidad en carrito
            const cantidadEnCarrito = carrito2.cantidad
            const nuevaCantidad = cantidadEnCarrito + cantidad
            const totalCarrito = (precio_unitario*nuevaCantidad)+carrito2.total
            await this.actualizarCantidadEnCarrito(nuevaCantidad, id_carrito2);
            await this.actualizarTotalEnCarrito(totalCarrito, id_carrito2);
          }
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

  async obtenerProductoRefCarrito(idProducto: any, idcarrito:any) {
    try {
      const { data, error } = await this.supabase
        .from('ref_carrito')
        .select('*')
        .eq('id_producto', idProducto)
        .eq('id_carrito', idcarrito)
        .single();
  
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

  //Funciones Kevin
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
  ;
    } catch (error) {
      console.error('Error actualizando la cantidad del producto: ', error);
      throw error;
    }
  }

  async actualizarTotalEnCarrito(nuevaCantidad: any, id_carrito: any) {
    try {
      const { data, error } = await this.supabase
        .from('carrito')
        .update({ 
          total: nuevaCantidad
         })
        .eq('id_carrito', id_carrito);
  
      if (error) {
        console.error("Error actualizando la cantidad: ", error);
        throw error;
      }
  
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
  
    } catch (error) {
      console.error('Error actualizando la cantidad del producto: ', error);
      throw error;
    }
  }
  /////////////////////////////////////////////


  //DE AQUI PARA ABAJO ES LO QUE HICE
  async obtenerProductosCarrito(idCarrito: any) {
    try {
      const { data, error } = await this.supabase
        .from('ref_carrito')
        .select(`
          *,
          producto:producto(id_producto, nombre, descripcion, precio, imagen)  
        `)
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

  async limpiarCarrito(userId: any) {
    const carrito = await this.authService.getCarrito(userId);
    if (carrito) {
      const { error } = await this.supabase
      .from('ref_carrito')
      .delete()
      .eq('id_carrito', carrito.id_carrito);

      if (error) {
        console.error('Ocurrió un error al intentar limpiar el carrito: ', error);
        throw error;
      }
    }
  }

  async eliminarItemCarrito(id_refcarrito: any) {

    const { data, error } = await this.supabase
      .from('ref_carrito')
      .delete()
      .eq('id_refcarrito', id_refcarrito);

    if (error) {
      console.error('Error eliminando el producto del carrito: ', error);
      throw error;
    }

    return data;
  }

  async guardarRefCompra(refCompraData: { id_compra: number; id_producto: string; precio_unitario: number; cantidad: number; total: number }): Promise<void> {
    try {
      console.log('Datos a insertar en ref_compra:', refCompraData);
  
      const { error } = await this.supabase
        .from('ref_compra')
        .insert([refCompraData]);
  
      if (error) {
        console.error('Error al guardar en ref_compra:', error);
        throw error;
      }
  
      console.log('Referencia de compra guardada exitosamente.');
    } catch (error) {
      console.error('Error inesperado en guardarRefCompra:', error);
      throw error;
    }
  }

  async guardarCompra(compraData: { estado: string; cantidad: number; total: number; id_usuario: string }): Promise<number | null> {
    try {
      const { data, error } = await this.supabase
        .from('compra')
        .insert([compraData])
        .select('id_compra')
        .single();
  
      if (error) {
        console.error('Error al guardar la compra:', error);
        return null;
      }
  
      console.log('Compra guardada con éxito:', data);
      return data.id_compra;
    } catch (error) {
      console.error('Error inesperado al guardar la compra:', error);
      return null;
    }
  }


  

}


