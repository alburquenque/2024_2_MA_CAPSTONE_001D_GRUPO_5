import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detalle-carritos',
  templateUrl: './detalle-carritos.page.html',
  styleUrls: ['./detalle-carritos.page.scss'],
})
export class DetalleCarritosPage implements OnInit {
  carritos: any;
  private carritoSubscription!: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.obtenerDatos(localStorage.getItem('id_usuario'));
    
    this.subscribeToRealtimeCarrito();
  }

  async obtenerDatos(id: any) {
    try {
      const datos = await this.authService.getDetallesCarritoRealtime(id);

      if (datos && datos.length > 0) {
        this.carritos = datos[0];
        this.cdr.detectChanges();
        this.cdr.markForCheck();
      } else {
        this.carritos = null;
      }
    } catch (error) {
      console.error('Error obteniendo carrito:', error);
      this.carritos = null;
    }
  }

  private subscribeToRealtimeCarrito() {
    this.carritoSubscription = this.authService.getRealtimeCarritoUpdates()
      .subscribe(payload => {
        console.log('Cambio detectado:', payload);
        this.obtenerDatos(localStorage.getItem('id_usuario'));
      });
  }

  ngOnDestroy() {
    if (this.carritoSubscription) {
      this.carritoSubscription.unsubscribe();
    }
  }

  irCarritoRealtime() {
    this.router.navigate(['/carrito-realtime']);
  }

  CheckCard() {
    const card = document.querySelector('ion-card');
    if (card) {
      const cardHeight = card.clientHeight;
      const cardContent = card.querySelector('ion-card-content');
      if (cardContent) {
        console.log("La altura ahora es de", cardHeight)
        if (cardHeight < 700) {
          cardContent.classList.remove('paddingCarrito');
        } else {
          cardContent.classList.add('paddingCarrito');
        }
      }
    }
  }
}
