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
      return
    }
    const user = await this.supabase.auth.getUser()

    if (user.data.user) {
      this.currentUser.next(user.data.user)
    } else {
      this.currentUser.next(false)
    }
  }

  ///////////////////////////////////////////

  signUp(credentials: { email: any; password: any }) {
    return this.supabase.auth.signUp(credentials)
  }

  async signIn(credentials: { email: any, password: any }): Promise<any> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword(credentials);
  
      if (error) {
        console.error('Error en inicio de sesión:', error);
        return { error };
      }
      else{
        await this.guardarInfo(data.user.id, data.session?.access_token)
      }
  
      return { data, error };
    } catch (error) {
      console.error('Error en el proceso de inicio de sesión:', error);
      return { error };
    }
  }
  
  async signOut() {
    await this.supabase.auth.signOut()
    this.router.navigateByUrl('/', { replaceUrl: true })
    localStorage.clear()
  }

  //Para que el inicio de sesión sea constante
async checkSession() {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) { 
    const { data, error } = await this.supabase.auth.getUser(accessToken);
    if (!error && data.user) {
      console.log("sesion restaurada")
      return data.user;
    } else {
      this.signOut();
      return null;
    }
  }
  else{
    return null;
  }
}

async guardarInfo(id: any, token:any){
  const userId = id;
  const userDetails = await this.getUserDetails(userId); 
  if (userDetails) {
    localStorage.setItem('userData', JSON.stringify(userDetails)); 
    localStorage.setItem('accessToken', token);
  }
}

  ////////////////////////////////////

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

  async getUserDetails(userId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('usuario')
      .select('*')
      .eq('id_usuario', userId)
      .single();
  
    if (error) {
      console.error('Error obteniendo detalles del usuario:', error);
      throw error;
    }
  
    return data;
  }

  getLocalUserData(){
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  };

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

  async getCarritoRealtime(){
    try {
      const { data, error } = await this.supabase
      .from('carrito')
      .select(`
        id_carrito,
        estado,
        cantidad,
        total,
        id_usuario,
        usuario (
          nombre,
          apellido,
          imagen
        )
      `)
      .eq('estado', 'Activo')

      if (error){
        return null;
      } 
      return data;
    } catch (error) {
      console.error('Error obteniendo carrito: ', error);
      return null;
    }
  }

  async getDetallesCarritoRealtime(id:any){
    try {
      const { data, error } = await this.supabase
      .from('usuario')
      .select(`
        nombre,
        apellido,
        imagen,
        carrito(
          *,
          ref_carrito(*,
            producto(*)
            )
          )
      `)
      .eq('id_usuario', id)

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
    let consulta: number;
    const { data, error } = await this.supabase
    .from('usuario')
    .select('*')
    .eq('email', email)
    .single();

    if (error){
      consulta=1;
    }
    if(data){
      consulta=2
      return consulta;
    }
    if(consulta = 1){
      try {
        const { data, error } = await this.supabaseService.getSupabase().auth.signUp({
          email,
          password
        });
        if (data?.user) {
          const id_usuario = data.user?.id;
          const avatarDefectoUsuario = `${environment.supabaseUrl}/storage/v1/object/public/perfiles/default_avatar.jpg`;
          const { error: profileError } = await this.supabaseService.getSupabase()
            .from('usuario')
            .insert({
              id_usuario,
              nombre,
              apellido,
              email,
              id_rol: 1, // Cliente por defecto. 2 es admin, y 3 es superadmin. Esos se crean de la BD.
              id_categoriacliente: 1, // Sin categoria al registrarse,
              imagen: avatarDefectoUsuario
            });

          if (profileError) {
            console.error('Error al insertar en la tabla usuario:', profileError);
            throw profileError;
          }
        }

        return data;
      } catch (error) {
        console.error('Error en el registro:', error);
        return null;
      }
     }
     else{
      return 1;
     }
    }

  async subirFotoPerfil(file: File, idUsuario: any): Promise<string | null> {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await this.supabase
        .storage
        .from('perfiles')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = this.supabase
        .storage
        .from('perfiles')
        .getPublicUrl(fileName);

      return urlData?.publicUrl || null; 
    } catch (error) {
      console.error('Error subiendo imagen: ', error);
      return null;
    }
  }

  async actualizarPerfil(profileData: {
    id_usuario: string;
    nombre: string;
    apellido: string;
    imagen: string;
  }) {
    try {
      const { error } = await this.supabase
        .from('usuario')
        .update({
          nombre: profileData.nombre,
          apellido: profileData.apellido,
          imagen: profileData.imagen
        })
        .eq('id_usuario', profileData.id_usuario);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  }
}
