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
  
  @ViewChild('chartVentasPorCategoria', { static: true }) chartVentasPorCategoria!: ElementRef;
  @ViewChild('chartTopProductos', { static: true }) chartTopProductos!: ElementRef;


  metricas: {
    topProductos: { nombre: string; cantidad: number }[];
    totalVentas: number;
    ventasPorCategoria: { categoria: string; cantidad: number, total: number }[];
  } = {
    topProductos: [],
    totalVentas: 0,
    ventasPorCategoria: [],
  };

  constructor(private reportesService: ReportesService, private toastController: ToastController) {}

  async ngOnInit() {
    await this.cargarMetricas();
    this.crearGraficos();
  }

  async cargarMetricas() {
    try {
      const [topProductos, totalVentas, ventasPorCategoria] = await Promise.all([
        this.reportesService.getTopProductos(5),
        this.reportesService.getTotalVentas(),
        this.reportesService.getVentasPorCategoria(),
      ]);

      this.metricas = {
        topProductos,
        totalVentas,
        ventasPorCategoria,
      };
    } catch (error) {
      console.error('Error cargando las métricas:', error);
    }
  }

  crearGraficos() {
      new Chart(this.chartVentasPorCategoria.nativeElement, {
      type: 'bar',
      data: {
        labels: this.metricas.ventasPorCategoria.map(v => v.categoria),
        datasets: [
          {
            label: 'Cantidad por Categoría',
            data: this.metricas.ventasPorCategoria.map(v => v.cantidad),
            backgroundColor: 'rgba(129, 140, 248, 0.85)', 
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 1,
            borderRadius: 8,
            barThickness: 40,
          },
          {
            label: 'Total por Categoría ($)',
            data: this.metricas.ventasPorCategoria.map(v => v.total),
            backgroundColor: 'rgba(244, 114, 182, 0.85)', 
            borderColor: 'rgba(236, 72, 153, 1)',
            borderWidth: 1,
            borderRadius: 8,
            barThickness: 40,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              padding: 20,
              font: {
                family: "'Inter', sans-serif",
                size: 13,
              },
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            titleColor: 'rgba(255, 255, 255, 1)',
            bodyColor: 'rgba(255, 255, 255, 0.8)',
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return ` ${context.dataset.label}: ${new Intl.NumberFormat('es-CL', {
                  style: context.datasetIndex === 1 ? 'currency' : 'decimal',
                  currency: 'CLP'
                }).format(value)}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
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
              color: 'rgba(243, 244, 246, 1)',
            },
            ticks: {
              font: {
                family: "'Inter', sans-serif",
                size: 12,
              },
              color: '#6B7280',
              padding: 8,
              callback: (value) => new Intl.NumberFormat('es-CL').format(value as number),
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

    new Chart(this.chartTopProductos.nativeElement, {
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
          legend: {
            display: true,
            position: 'top',
            labels: {
              padding: 20,
              font: {
                family: "'Inter', sans-serif",
                size: 13,
              },
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            titleColor: 'rgba(255, 255, 255, 1)',
            bodyColor: 'rgba(255, 255, 255, 0.8)',
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
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
