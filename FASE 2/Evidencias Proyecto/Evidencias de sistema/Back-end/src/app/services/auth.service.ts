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
  private sessionInitialized = false;

  private carritosSubject = new BehaviorSubject<any[]>([]); // Lista reactiva de carritos
  carritos$ = this.carritosSubject.asObservable();

  constructor(private supabaseService: SupabaseService, private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)

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
  
      const userDetails = await this.getUserDetails(data.user.id);
  
      await this.guardarInfo(data.user.id, data.session?.access_token);

        this.userRole.next(userDetails.id_rol);
        this.currentUser.next(userDetails);
        this.sessionInitialized = true;
        this.redirigirBasadoEnRol(userDetails.id_rol)
  
      console.log('Inicio de sesión exitoso:', userDetails);
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

  //  //Temas de sesión de usuario local, podría usarse otro método 
  //  async checkSession(): Promise<boolean> {
  //   if (this.sessionChecked) {
  //     console.log('Se checkeo la wea')
  //     // Si ya verificaste la sesión, evita redirecciones innecesarias
  //     return !!this.currentUser.value;
  //   }

  //   const { data: session, error } = await this.supabase.auth.getSession();

  //   if (error || !session?.session) {
  //     this.sessionChecked = true; // Marca como verificada
  //     this.currentUser.next(null);
  //     this.userRole.next(null);
  //     return false;
  //   }

  //   const user = session.session.user;

  //   if (user) {
  //     try {
  //       const userDetails = await this.getUserDetails(user.id);
  //       this.currentUser.next(user);
  //       this.userRole.next(userDetails.id_rol);
  //       this.sessionChecked = true; // Marca como verificada
  //       return true;
  //     } catch (err) {
  //       console.error('Error al obtener detalles del usuario:', err);
  //       this.signOut();
  //       return false;
  //     }
  //   }

  //   this.sessionChecked = true; // Marca como verificada
  //   this.currentUser.next(null);
  //   return false;
  // }

  async initializeSession(): Promise<void> {
    if (this.sessionInitialized){
      console.log("salí en 1")
      return; // Evita que se llame varias veces
    }  

    const { data: session, error } = await this.supabase.auth.getSession();

    if (error || !session?.session) {
      this.currentUser.next(null);
      this.userRole.next(null);
    } else {
      const user = session.session.user;

      try {
        const userDetails = await this.getUserDetails(user.id);
        this.currentUser.next(user);
        this.userRole.next(userDetails.id_rol);
      } catch (err) {
        console.error('Error al inicializar sesión:', err);
        this.currentUser.next(null);
        this.userRole.next(null);
      }
    }

    this.sessionInitialized = true; // Marca la sesión como inicializada
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser.value;
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

  async getCurrentUserId(): Promise<string> {
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
  
    console.log('Detalles del usuario obtenidos:', data);
    return data;
  }

  async guardarInfo(id: any, token: any) {
    const userId = id;
    const userDetails = await this.getUserDetails(userId);
  
    if (userDetails && token) {
      localStorage.setItem('userData', JSON.stringify(userDetails));
      localStorage.setItem('accessToken', token);
      console.log('Información guardada en localStorage:', userDetails, token);
    } else {
      console.error('Datos insuficientes para guardar en localStorage:', userDetails, token);
    }
  }

  getLocalUserData(): any {
    const userData = localStorage.getItem('userData'); // Recuperar datos desde localStorage
    return userData ? JSON.parse(userData) : null; // Parsear a objeto si existen datos
  }
  

  // Temas de carrito deberia ir en carrito, de ahi se mueve
  async getCarrito(userId: string) {
    try {
      // Se mejoró esto para además obtener los productos relacionados
      const { data, error } = await this.supabase
        .from('carrito')
        .select(`
          *,
          items:ref_carrito(
            id_producto,
            cantidad,
            precio_unitario,
            producto:producto(
              nombre,
              descripcion,
              precio,
              imagen
            )
          )
        `)
        .eq('id_usuario', userId)
        .single();
  
      if (error) {
        console.error('Error al obtener el carrito:', error);
        return null;
      }
  
      return data; 
    } catch (error) {
      console.error('Error obteniendo carrito:', error);
      return null;
    }
  }

  async getCarritoRealtime() {
    try {
      const { data, error } = await this.supabase
        .from('carrito')
        .select(`
          id_carrito,
          cantidad,
          total,
          id_usuario,
          usuario (
            nombre,
            apellido,
            imagen
          ),
          ref_carrito (
            id_refcarrito
          )
        `)
        .filter('cantidad', 'gt', 0)
        .filter('ref_carrito.id_refcarrito', 'not.is', null);

      if (error) {
        console.error('Error en la consulta inicial:', error);
        return null;
      }

      this.carritosSubject.next(data || []);
      return data;
    } catch (error) {
      console.error('Error obteniendo carrito: ', error);
      return null;
    }
  }

  // Método para suscribirse a cambios en tiempo real
  subscribeToRealtimeCarrito() {
    this.supabase
      .channel('carrito-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'carrito' },
        (payload) => {
          console.log('Cambio detectado en carrito:', payload);
        }
      )
      .subscribe();
  }

  getRealtimeCarritoUpdates(): Observable<any> {
    return new Observable(observer => {
      const channel = this.supabase
        .channel('carrito-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'carrito' },
          (payload) => {
            observer.next(payload);
          }
        )
        .subscribe();

      // Método de limpieza
      return () => {
        channel.unsubscribe();
      };
    });
  }
  

  async getDetallesCarritoRealtime(id: any) {
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
        .eq('id_usuario', id);
  
      if (error) {
        console.error('Error cargando detalles del carrito:', error);
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

  //Metodos para cambiar la contraseña

  async updatePassword(newPassword: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error actualizando contraseña:', error);
      return false;
    }
  }

  async verifyPassword(currentPassword: string): Promise<boolean> {
    // Puedes verificar si la contraseña actual es válida reautenticando al usuario
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: (await this.supabase.auth.getUser()).data.user?.email || '',
      password: currentPassword,
    });
    return !error;
  }
}