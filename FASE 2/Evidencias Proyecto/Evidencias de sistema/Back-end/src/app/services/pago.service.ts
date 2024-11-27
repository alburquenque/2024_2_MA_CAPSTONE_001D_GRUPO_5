import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SupabaseClient, createClient  } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

export interface WebPayResponse {
  token: string;
  url: string;
}

export interface PaymentInitiation {
  amount: number;
  buyOrder: string;
  sessionId: string;
  returnUrl: string;
}

export interface TransactionStatusResponse {
  status: 'success' | 'error' | 'cancelled';
  message: string;
  details?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private supabase: SupabaseClient;
  private apiUrl = 'https://webpay-scanbuy.onrender.com/api/pago';

  constructor(private http: HttpClient) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  initiatePayment(data: PaymentInitiation): Observable<WebPayResponse> {
    return this.http.post<WebPayResponse>(`${this.apiUrl}/init`, data)
      .pipe(
        tap(response => {
          console.log('Respuesta WebPay:', response);
        })
      );
  }

  async crearCompra(compraData: any) {
    try {
      const { data, error } = await this.supabase
        .from('compra')
        .insert(compraData)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creando la compra: ', error);
      throw error;
    }
  }

  async crearRefCompra(refCompraData: any) {
    try {
      const { data, error } = await this.supabase
        .from('ref_compra')
        .insert(refCompraData)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creando la referencia de compra: ', error);
      throw error;
    }
  }

  confirmTransaction(token: string): Observable<TransactionStatusResponse> {
    return this.http.post<TransactionStatusResponse>(`${this.apiUrl}/confirmar`, { token_ws: token })
      .pipe(
        tap(response => {
          console.log('Estado de la transacción:', response);
        })
      );
  }

}
