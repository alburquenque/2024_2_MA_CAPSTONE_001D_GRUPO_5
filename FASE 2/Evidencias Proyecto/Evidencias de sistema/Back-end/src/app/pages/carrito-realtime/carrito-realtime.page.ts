import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-carrito-realtime',
  templateUrl: './carrito-realtime.page.html',
  styleUrls: ['./carrito-realtime.page.scss'],
})
export class CarritoRealtimePage implements OnInit {

  carritos : any
  private subscription!: Subscription;

  constructor(private router: Router, 
              private popoverController: PopoverController,
              private authService: AuthService) { }

  ngOnInit() {
    this.authService.getCarritoRealtime();
    this.authService.subscribeToRealtimeCarrito();

    this.subscription = this.authService.carritos$.subscribe((data) => {
      this.obtenerCarritos()
      console.log('Carritos actualizados:', this.carritos);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  async irAlDetalle(id:any) {
    try {
      await this.popoverController.dismiss(); 
    } catch (error) {
    }
    localStorage.setItem('id_usuario', id)
    this.router.navigate(['/detalle-carritos']);
  } 

  async obtenerCarritos(){
    this.carritos =  await this.authService.getCarritoRealtime()
    console.log("carritos: ",this.carritos)
  }
  
}
