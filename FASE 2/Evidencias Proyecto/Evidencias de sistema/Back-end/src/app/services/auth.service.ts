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
  private userRole = new BehaviorSubject<number | null>(null);

  constructor(private supabaseService: SupabaseService, private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)

    this.supabase.auth.onAuthStateChange((event, sess) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log('SET USER')

    if (sess && sess.user) {
      this.currentUser.next(sess.user);
    } else {
      this.currentUser.next(false); 
    }
  } else {
    this.currentUser.next(false); 
  }
    })

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

  // Temas de login, registro, cierre de sesión
  getUserRole(): Observable<number | null> {
    return this.userRole.asObservable();
  }

  async signIn(credentials: { email: any, password: any }): Promise<any> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword(credentials);
      if (error) throw error;
  
      const [userDetails, _] = await Promise.all([
        this.getUserDetails(data.user.id),
        this.guardarInfo(data.user.id, data.session?.access_token)
      ]);
  
      this.userRole.next(userDetails.id_rol);
      await this.redirigirBasadoEnRol(userDetails.id_rol);
  
      return { data };
    } catch (error) {
      console.error('Error en el proceso de inicio de sesión:', error);
      return { error };
    }
  }

  private async redirigirBasadoEnRol(role: number) {
    switch (role) {
      case 1:
        await this.router.navigate(['/home']);
        break;
      case 2:
        await this.router.navigate(['/home-admin']);
        break;
      case 3:
        await this.router.navigate(['/home-superadmin']);
        break;
      default:
        await this.router.navigate(['/login']);
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

  signUp(credentials: { email: any; password: any }) {
    return this.supabase.auth.signUp(credentials)
  }


  
  async signOut() {
    await this.supabase.auth.signOut()
    this.router.navigateByUrl('/', { replaceUrl: true })
    localStorage.clear()
  }

  //Temas de sesión de usuario local, podría usarse otro método 
  async checkSession() {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) { 
      const { data, error } = await this.supabase.auth.getUser(accessToken);
      if (!error && data.user) {
        const userDetails = await this.getUserDetails(data.user.id);
        this.userRole.next(userDetails.id_rol);
        console.log("sesion restaurada");
        return data.user;
      } else {
        this.userRole.next(null);
        this.signOut();
        return null;
      }
    }
    else {
      this.userRole.next(null);
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

  // Temas de cambio de contraseña
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

  // Temas de carrito deberia ir en carrito, de ahi se mueve
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

  // Temas de perfil
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
