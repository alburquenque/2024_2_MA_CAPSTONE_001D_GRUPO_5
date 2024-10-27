import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Router } from '@angular/router'
import { isPlatform } from '@ionic/angular'
import { createClient, SupabaseClient, User } from '@supabase/supabase-js'
import { BehaviorSubject, Observable, from } from 'rxjs'
import { environment } from '../../environments/environment'



@Injectable({
  providedIn: 'root'
})



export class AuthService {
  private supabase: SupabaseClient
  private currentUser: BehaviorSubject<User | boolean | null> = new BehaviorSubject<User | boolean | null>(null);
  constructor(private supabaseService: SupabaseService, private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)

    this.supabase.auth.onAuthStateChange((event, sess) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log('SET USER')

    if (sess && sess.user) {
      this.currentUser.next(sess.user); // Set the current user
    } else {
      this.currentUser.next(false); // Or handle this case as needed
    }
  } else {
    this.currentUser.next(false); // Set current user to false on sign out
  }
    })

    // Trigger initial session load
    this.loadUser()
  }

  

  async loadUser() {
    if (this.currentUser.value) {
      // User is already set, no need to do anything else
      return
    }
    const user = await this.supabase.auth.getUser()

    if (user.data.user) {
      this.currentUser.next(user.data.user)
    } else {
      this.currentUser.next(false)
    }
  }

  signUp(credentials: { email: any; password: any }) {
    return this.supabase.auth.signUp(credentials)
  }

  signIn(credentials: { email: any, password: any }) {
    return this.supabase.auth.signInWithPassword(credentials)
  }


  async signOut() {
    await this.supabase.auth.signOut()
    this.router.navigateByUrl('/', { replaceUrl: true })
  }

  reset_password(email: any) {
    return this.supabase.auth.resetPasswordForEmail(email)
  }
  changePassword(newPassword: string) {
    return this.supabase.auth.updateUser({ password: newPassword});
  }

  getCurrentUser(): Observable<User | boolean | null> {
    return this.currentUser.asObservable()
  }

  getCurrentUserId(): string {
    if (this.currentUser.value) {
      return (this.currentUser.value as User).id
    } 
    else {
      return "null"
    }
  }

  signInWithEmail(email: string) {
    return this.supabase.auth.signInWithOtp({ email })
  }

  verifyOTP(email: string, token:any) {
    return this.supabase.auth.verifyOtp(
      {"email": email, "token": token, "type": "email"}
    )
  }

  getUserDetails(userId: string): Observable<any> {
    //const userIdInt = parseInt(userId, 10);
    return from(this.supabase
      .from('usuario')
      .select('*')
      .eq('id_usuario', userId)
      .single());
  }


  async getCarrito(userId: string) {
    try {
      const { data, error } = await this.supabase
      .from('carrito')
      .select('*')
      .eq('id_usuario', userId)
      .single();

      if (error){
        return null;
      } 
      return data;
    } catch (error) {
      console.error('Error obteniendo carrito: ', error);
      return null;
    }
  }

  








  async register(email: string, password: string, nombre: string, apellido: string) {
    try {

      const { data, error } = await this.supabaseService.getSupabase().auth.signUp({
        email,
        password
      });
      if (data?.user) {
        const id_usuario = data.user?.id;
        const { error: profileError } = await this.supabaseService.getSupabase()
          .from('usuario')
          .insert({
            id_usuario,
            nombre,
            apellido,
            email,
            id_rol: 1, // Cliente por defecto. 2 es admin, y 3 es superadmin. Esos se crean de la BD.
            id_categoriacliente: 1 // Sin categoria al registrarse
          });

        if (profileError) {
          console.error('Error al insertar en la tabla usuario:', profileError);
          throw profileError;
        }
      }

      return data;
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }
}
