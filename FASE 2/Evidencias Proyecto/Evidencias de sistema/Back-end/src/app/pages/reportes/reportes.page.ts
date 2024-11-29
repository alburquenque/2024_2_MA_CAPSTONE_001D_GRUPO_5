import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { ReportesService } from 'src/app/services/reportes.service';
import * as XLSX from 'xlsx';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {
  
@ViewChild('chartCantidadPorCategoria', { static: true }) chartCantidadPorCategoria!: ElementRef;
  @ViewChild('chartVentasPorCategoria', { static: true }) chartVentasPorCategoria!: ElementRef;
  @ViewChild('chartTopProductos', { static: true }) chartTopProductos!: ElementRef;

  periodo: string = 'year'; 
  selectedPeriod: string = 'year';
  chart: any;
  chartCantidadPorCategoriaInstance: any;
  chartVentasPorCategoriaInstance: any;
  chartTopProductosInstance: any;
  metricas: {
    topProductos: { nombre: string; cantidad: number }[];
    totalVentas: number;
    cantidadVendida: number;
    ventasPorCategoria: { categoria: string; cantidad: number, total: number }[];
  } = {
    topProductos: [],
    totalVentas: 0,
    cantidadVendida: 0,
    ventasPorCategoria: [],
  };

  constructor(private reportesService: ReportesService, private toastController: ToastController) {}

  async ngOnInit() {
    await this.cargarMetricas();
    
    this.crearGraficos();
  }

  async cargarMetricas() {
    try {
      const [topProductos, totalVentas, cantidadVendida, ventasPorCategoria] = await Promise.all([
        this.reportesService.getTopProductos(5, this.periodo),
        this.reportesService.getTotalVentas(this.periodo),
        this.reportesService.getCantidadVendida(this.periodo),
        this.reportesService.getVentasPorCategoria(this.periodo),
      ]);

      this.metricas = {
        topProductos,
        totalVentas,
        cantidadVendida,
        ventasPorCategoria,
      };
    } catch (error) {
      console.error('Error cargando las métricas:', error);
    }
  }

  crearGraficos() {
    // Destruir gráficos existentes antes de crear nuevos
    if (this.chartCantidadPorCategoriaInstance) {
      this.chartCantidadPorCategoriaInstance.destroy();
    }
    if (this.chartVentasPorCategoriaInstance) {
      this.chartVentasPorCategoriaInstance.destroy();
    }
    if (this.chartTopProductosInstance) {
      this.chartTopProductosInstance.destroy();
    }

    // Gráfico de Cantidad por Categoría (Pie Chart)
    this.chartCantidadPorCategoriaInstance = new Chart(this.chartCantidadPorCategoria.nativeElement, {
      type: 'pie',
      data: {
        labels: this.metricas.ventasPorCategoria.map(v => v.categoria),
        datasets: [{
          data: this.metricas.ventasPorCategoria.map(v => v.cantidad),
          backgroundColor: [
            'rgba(129, 140, 248, 0.85)',
            'rgba(244, 114, 182, 0.85)', 
            'rgba(56, 189, 248, 0.85)',
            'rgba(34, 197, 94, 0.85)',
            'rgba(248, 113, 113, 0.85)'
          ],
          borderColor: [
            'rgba(99, 102, 241, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(14, 165, 233, 1)',
            'rgba(22, 163, 74, 1)',
            'rgba(220, 38, 38, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Cantidad de Productos por Categoría'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return ` ${context.label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });

    // Gráfico de Ventas por Categoría (Pie Chart)
    this.chartVentasPorCategoriaInstance = new Chart(this.chartVentasPorCategoria.nativeElement, {
      type: 'pie',
      data: {
        labels: this.metricas.ventasPorCategoria.map(v => v.categoria),
        datasets: [{
          data: this.metricas.ventasPorCategoria.map(v => v.total),
          backgroundColor: [
            'rgba(129, 140, 248, 0.85)',
            'rgba(244, 114, 182, 0.85)', 
            'rgba(56, 189, 248, 0.85)',
            'rgba(34, 197, 94, 0.85)',
            'rgba(248, 113, 113, 0.85)'
          ],
          borderColor: [
            'rgba(99, 102, 241, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(14, 165, 233, 1)',
            'rgba(22, 163, 74, 1)',
            'rgba(220, 38, 38, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Total de Ventas por Categoría'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return ` ${context.label}: $${new Intl.NumberFormat('es-CL').format(value)} (${percentage}%)`;
              }
            }
          }
        }
      }
    });

    // Gráfico de Top Productos (Horizontal Bar Chart)
    this.chartTopProductosInstance = new Chart(this.chartTopProductos.nativeElement, {
      type: 'bar',
      data: {
        labels: this.metricas.topProductos.map(p => p.nombre.length > 25 ? `${p.nombre.substring(0, 25)}...` : p.nombre),
        datasets: [
          {
            label: 'Top Productos (Cantidad)',
            data: this.metricas.topProductos.map(p => p.cantidad),
            backgroundColor: 'rgba(56, 189, 248, 0.85)', 
            borderColor: 'rgba(14, 165, 233, 1)',
            borderWidth: 1,
            borderRadius: 8,
            barThickness: 25,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          title: {
            display: true,
            text: 'Top 5 Productos Más Vendidos'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return ` Cantidad: ${new Intl.NumberFormat('es-CL').format(value)} unidades`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(243, 244, 246, 1)',
            },
            ticks: {
              font: {
                family: "'Inter', sans-serif",
                size: 12,
              },
              color: '#6B7280',
              padding: 8,
            },
            border: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                family: "'Inter', sans-serif",
                size: 12,
              },
              color: '#6B7280',
              padding: 12,
            },
            border: {
              display: false,
            },
          },
        },
        animation: {
          duration: 750,
          easing: 'easeInOutQuart',
        },
      },
    });
  }

  async onPeriodChange() {
    // Update the periodo property when selectedPeriod changes
    this.periodo = this.selectedPeriod;
    
    // Reload metrics when period is changed
    try {
      await this.cargarMetricas();
      this.crearGraficos(); // Recreate charts with new data
    } catch (error) {
      console.error('Error updating metrics:', error);
      this.mostrarError('No se pudieron actualizar las métricas');
    }
  }



  async exportarDatos() {
    try {
      const workbook = XLSX.utils.book_new();
      
      const wsVentasCategoria = XLSX.utils.json_to_sheet(this.metricas.ventasPorCategoria);
      const wsTopProductos = XLSX.utils.json_to_sheet(this.metricas.topProductos);
      
      XLSX.utils.book_append_sheet(workbook, wsVentasCategoria, 'Ventas por Categoria');
      XLSX.utils.book_append_sheet(workbook, wsTopProductos, 'Top Productos');
      
      XLSX.writeFile(workbook, `Reporte_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      const toast = await this.toastController.create({
        message: 'Reporte exportado exitosamente',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      toast.present();
    } catch (error) {
      console.error('Error al exportar:', error);
      this.mostrarError('Error al exportar los datos');
    }
  }

  private async mostrarError(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    toast.present();
  }


}
