import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import * as Papa from 'papaparse'; 

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

  async obtenerProductoPorId(idProducto: number): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('producto') // Nombre de la tabla
        .select('*') // Selecciona todas las columnas, o especifica las necesarias
        .eq('id_producto', idProducto) // Filtra por id_producto
        .single(); // Asegura que se obtiene un único registro
  
      if (error) throw error;
  
      return data; // Devuelve el producto
    } catch (error) {
      console.error('Error obteniendo producto por ID: ', error);
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

  async obtenerDetallesProducto(id: number) {
    try {
      const { data, error } = await this.supabase
        .from('producto')
        .select(`
          *,
          categoria (
            id_categoria,
            nombre
          )
        `)
        .eq('id_producto', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error obteniendo detalles del producto:', error);
      throw error;
    }
  }

  async actualizacionRapida(id: number, cambios: Partial<any>) {
    try {
      const { data, error } = await this.supabase
        .from('producto')
        .update(cambios)
        .eq('id_producto', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en actualización rápida:', error);
      throw error;
    }
  }

  async importarProductosCSV(file: File): Promise<any[]> {
    try {
      return new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true, 
          complete: async (results) => {
            try {
              const productosValidos = results.data.filter((row: any) => {
                return Object.values(row).some(value => 
                  value !== null && value !== undefined && value.toString().trim() !== ''
                );
              });

              const productos = productosValidos.map((row: any) => ({
                codigo_barras: row.codigo_barras?.trim() || null,
                nombre: row.nombre?.trim() || null,
                marca: row.marca?.trim() || null,
                annio: row.annio ? parseInt(row.annio) : null,
                precio: row.precio ? parseFloat(row.precio) : null,
                id_categoria: row.id_categoria ? parseInt(row.id_categoria) : null,
                descripcion: row.descripcion?.trim() || null,
                imagen: row.imagen?.trim() || null,
              }));

              if (productos.length > 0) {
                const { data, error } = await this.supabase
                  .from('producto')
                  .insert(productos);

                if (error) throw error;
                resolve(data || []);
              } else {
                reject(new Error('No se encontraron productos válidos en el archivo CSV'));
              }
            } catch (error) {
              reject(error);
            }
          },
          error: (error) => {
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Error importando productos:', error);
      throw error;
    }
  }

  async obtenerCompraDelVoucher(idCompra: number): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('voucher') // Asegúrate de que esta es la tabla correcta
        .select('id_voucher,id_compra, total') // Selecciona las columnas necesarias
        .eq('id_compra', idCompra)
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error al obtener compra:", error);
      throw error;
    }
  }

  async obtenerVoucherEntero(idVoucher:any){
    try {
      const { data, error } = await this.supabase
      .from('voucher')
      .select(`
        id_voucher,
        total,
        id_compra,
        estado,
        compra(
          *,
          ref_compra(*,
            producto(*)
            )
          )
      `)
      .eq('id_voucher', idVoucher)

      if (error){
        return null;
      } 
      return data;
    } catch (error) {
      console.error('Error obteniendo carrito: ', error);
      return null;
    }
  }
  
  async modificarEstado(idCompra: number): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('compra') 
        .update({ estado: 'Validado' }) // Aquí pasamos un objeto con los campos a actualizar
        .eq('id_compra', idCompra); // Filtro por el id de la compra
  
      if (error) throw error;
  
      return data || []; // Devuelve los datos actualizados o un array vacío si no hay resultados
    } catch (error) {
      console.error('Error al modificar el estado de la compra:', error);
      throw error;
    }
  }
  async modificarEstadoVoucher(idVoucher: number): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('voucher') 
        .update({ estado: 'Completado' }) // Aquí pasamos un objeto con los campos a actualizar
        .eq('id_voucher', idVoucher); // Filtro por el id de la compra
  
      if (error) throw error;
  
      return data || []; // Devuelve los datos actualizados o un array vacío si no hay resultados
    } catch (error) {
      console.error('Error al modificar el estado de la compra:', error);
      throw error;
    }
  }

  async obtenerEstadoCompra(idCompra: number): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('compra')
        .select('estado')
        .eq('id_compra', idCompra)
        .single();
  
      if (error) throw error;
  
      return data; // Devuelve el estado actual de la compra
    } catch (error) {
      console.error('Error al obtener el estado de la compra:', error);
      return null;
    }
  }

  async obtenerEstadoVoucher(idCompra: number): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('voucher')
        .select('estado')
        .eq('id_compra', idCompra)
        .single();
  
      if (error) throw error;
  
      return data; // Devuelve el estado actual del voucher
    } catch (error) {
      console.error('Error al obtener el estado del voucher:', error);
      return null;
    }
  }
  
  
  


  

}
  




  

  



