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

  selectedPeriod: string = 'today';


  private filtrarPorPeriodo(query: any, periodo: string) {
    switch (periodo) {
      case 'today':
        return query.gte('fecha', new Date().toISOString().split('T')[0]);
      case 'week':
        const weekStart = new Date(new Date().setDate(new Date().getDate() - new Date().getDay()));
        return query.gte('fecha', weekStart.toISOString().split('T')[0]);
      case 'month':
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        return query.gte('fecha', monthStart.toISOString().split('T')[0]);
      case 'year':
        const yearStart = new Date(new Date().getFullYear(), 0, 1);
        return query.gte('fecha', yearStart.toISOString().split('T')[0]);
      default:
        return query;
    }
  }

// Obtenemos los 5 productos más vendidos y su cantidad
async getTopProductos(limit: number = 5, periodo: string): Promise<{ nombre: string; cantidad: number }[]> {
  try {
    let query = this.supabase.from('ref_compra').select(`cantidad, producto:producto(nombre)`);
    query = this.filtrarPorPeriodo(query, periodo)
    const { data, error } = await query.order('cantidad', { ascending: false }).limit(limit);

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

async getTotalVentas(periodo: string): Promise<number> {
  try {
    let query = this.supabase.from('ref_compra').select('total');
    query = this.filtrarPorPeriodo(query, periodo);
    const { data, error } = await query;

    if (error) throw error;

    // Sumamos los valores de la columna `total`
    const totalVentas = data.reduce((sum: number, item: any) => sum + item.total, 0);

    return totalVentas;
  } catch (error) {
    console.error('Error obteniendo el total de ventas:', error);
    return 0;
  }
}

async getCantidadVendida(periodo: string): Promise<number> {
  try {
    let query = this.supabase.from('ref_compra').select('cantidad');
    query = this.filtrarPorPeriodo(query, periodo);
    const { data, error } = await query;

    if (error) throw error;

    const cantidadVendida = data.reduce((sum: number, item: any) => sum + item.cantidad, 0);

    return cantidadVendida;
  } catch (error) {
    console.error('Error obteniendo la cantidad vendida:', error);
    return 0;
  }
}

async getVentasPorCategoria(periodo: string): Promise<{ categoria: string; cantidad: number; total: number }[]> {
  try {
    let query = this.supabase.from('ref_compra').select(`cantidad, total, producto(id_categoria, categoria(nombre))`);
    query = this.filtrarPorPeriodo(query, periodo);
    const { data, error } = await query;

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




