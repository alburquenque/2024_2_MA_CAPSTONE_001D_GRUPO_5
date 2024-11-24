import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { HistorialService } from 'src/app/services/historial.service';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-historial-detalles',
  templateUrl: './historial-detalles.page.html',
  styleUrls: ['./historial-detalles.page.scss'],
})
export class HistorialDetallesPage implements OnInit {
  
  compras: any
  qrGenerated: boolean = false;
  qrCodeData: string | null = null; 

  constructor(private router: Router,
              private historialService: HistorialService) { }

  async ngOnInit() {
    await this.obtenerDatos(localStorage.getItem('id_voucher'))
    console.log("se obtuvieron los datos")
  }

  async CodigoQR(text: any){
    try {
      this.qrCodeData = await this.generateQRCode(text.toString())
      this.qrGenerated = true
    
    } catch (error) {
      console.error('Error al generar QR:', error)
    }
    

  }

  
  async obtenerDatos(id:any){
    this.compras = await this.historialService.getCompraEspecifica(id)
    console.log("Compras: ", this.compras)
  }

  async generateQRCode(text: string): Promise<string> {
    try {
      return await QRCode.toDataURL(text, {
        errorCorrectionLevel: 'H',
        width: 200,
        margin: 2
      });
      
    } catch (error) {
      console.error('Error al generar QR:', error);
      return '';
    }
  }

}
