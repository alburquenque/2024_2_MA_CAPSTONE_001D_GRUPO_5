import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private supabase: SupabaseClient;
  
  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

// Obtenemos los 5 productos más vendidos y su cantidad
async getTopProductos(limit: number = 5): Promise<{ nombre: string; cantidad: number }[]> {
  try {
    const { data, error } = await this.supabase
      .from('ref_compra')
      .select(`
        cantidad,
        producto:producto(nombre)
      `);

    if (error) throw error;

    // Agrupamos por nombre y sumamos las cantidades
    const datosAgrupados = data.reduce((acc: any, item: any) => {
      const nombre = item.producto.nombre;
      if (!acc[nombre]) {
        acc[nombre] = { nombre, cantidad: 0 };
      }
      acc[nombre].cantidad += item.cantidad;
      return acc;
    }, {});

    // Convertimos el objeto agrupado en un arreglo y ordenamos por cantidad
    const productos = Object.values(datosAgrupados)
      .sort((a: any, b: any) => b.cantidad - a.cantidad)
      .slice(0, limit); 

    return productos as { nombre: string; cantidad: number }[];
  } catch (error) {
    console.error('Error obteniendo los productos más vendidos:', error);
    return [];
  }
}

async getTotalVentas(): Promise<number> {
  try {
    const { data, error } = await this.supabase
      .from('ref_compra') // Asegúrate de que 'compra' es la tabla correcta
      .select('total');

    if (error) throw error;

    // Sumamos los valores de la columna `total`
    const totalVentas = data.reduce((sum: number, item: any) => sum + item.total, 0);

    return totalVentas;
  } catch (error) {
    console.error('Error obteniendo el total de ventas:', error);
    return 0;
  }
}

async getVentasPorCategoria(): Promise<{ categoria: string; cantidad: number; total: number }[]> {
  try {
    const { data, error } = await this.supabase
      .from('ref_compra')
      .select(`
        cantidad,
        total,
        producto(
          id_categoria,
          categoria(nombre)
        )
      `);

    if (error) throw error;

    // Agrupamos por categoría y sumamos tanto la cantidad como el total
    const ventasPorCategoria = data.reduce((acc: Record<string, { cantidad: number; total: number }>, item: any) => {
      const categoria = item.producto.categoria.nombre; // Nombre de la categoría
      if (!acc[categoria]) {
        acc[categoria] = { cantidad: 0, total: 0 };
      }
      acc[categoria].cantidad += item.cantidad; // Sumamos la cantidad
      acc[categoria].total += item.total; // Sumamos el total
      return acc;
    }, {});

    // Convertimos el objeto agrupado en un arreglo
    return Object.entries(ventasPorCategoria).map(([categoria, valores]) => ({
      categoria,
      cantidad: valores.cantidad,
      total: valores.total,
    }));
  } catch (error) {
    console.error('Error obteniendo ventas por categoría:', error);
    return [];
  }
}

}




