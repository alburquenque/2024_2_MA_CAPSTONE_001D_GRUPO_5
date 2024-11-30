import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',  
    pathMatch: 'full'
  },
  // Rutas públicas
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'forgot-password2',
    loadChildren: () => import('./pages/forgot-password2/forgot-password2.module').then(m => m.ForgotPassword2PageModule)
  },
  {
    path: 'payment/confirmation',
    loadChildren: () => import('./pages/confirmacion-pago/confirmacion-pago.module').then(m => m.ConfirmacionPagoPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/change-password/change-password.module').then(m => m.ChangePasswordPageModule) 
  },

  // Rutas protegidas para Cliente (Rol 1)
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [RoleGuard],
    data: { roles: [1] }
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then(m => m.PerfilPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [1, 2, 3] } 
  },
  {
    path: 'scanner',
    loadChildren: () => import('./pages/scanner/scanner.module').then(m => m.ScannerPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [1] }
  },
  {
    path: 'editar-perfil',
    loadChildren: () => import('./pages/editar-perfil/editar-perfil.module').then(m => m.EditarPerfilPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [1, 2, 3] }  
  },
  {
    path: 'edit-password',
    loadChildren: () => import('./pages/edit-password/edit-password.module').then( m => m.EditPasswordPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [1, 2, 3] }  
  },
  {
    path: 'historial',
    loadChildren: () => import('./pages/historial/historial.module').then( m => m.HistorialPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [1, 2, 3] }  
  },
  {
    path: 'historial-detalles',
    loadChildren: () => import('./pages/historial-detalles/historial-detalles.module').then( m => m.HistorialDetallesPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [1, 2, 3] }  
  },

  // Rutas protegidas para Admin (Rol 2) falta home administrador

  {
    path: 'home-admin',
    loadChildren: () => import('./pages/home-admin/home-admin.module').then( m => m.HomeAdminPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [2] }
  },

  {
    path: 'carrito-realtime',
    loadChildren: () => import('./pages/carrito-realtime/carrito-realtime.module').then(m => m.CarritoRealtimePageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [2] }
  },
  {
    path: 'detalle-carritos',
    loadChildren: () => import('./pages/detalle-carritos/detalle-carritos.module').then(m => m.DetalleCarritosPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [2] }
  },
  {
    path: 'scanner-qr',
    loadChildren: () => import('./pages/scanner-qr/scanner-qr.module').then(m => m.ScannerQrPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [2] }
  },


  // Rutas protegidas para SuperAdmin (Rol 3)
  {
    path: 'home-superadmin',
    loadChildren: () => import('./pages/home-superadmin/home-superadmin.module').then(m => m.HomeSuperadminPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [3] }
  },
  {
    path: 'agregar-productos',
    loadChildren: () => import('./pages/agregar-productos/agregar-productos.module').then(m => m.AgregarProductosPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [3] }
  },
  {
    path: 'modificar-producto',
    loadChildren: () => import('./pages/modificar-producto/modificar-producto.module').then(m => m.ModificarProductoPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [3] }
  },
  {
    path: 'modificar-producto/:id',
    loadChildren: () => import('./pages/modificar-producto/modificar-producto.module').then( m => m.ModificarProductoPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [3] }
  },

  {
    path: 'agregar-categoria',
    loadChildren: () => import('./pages/agregar-categoria/agregar-categoria.module').then(m => m.AgregarCategoriaPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [3] }
  },
  {
    path: 'listar-categorias',
    loadChildren: () => import('./pages/listar-categorias/listar-categorias.module').then(m => m.ListarCategoriasPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [3] }
  },
  {
    path: 'listar-productos',
    loadChildren: () => import('./pages/listar-productos/listar-productos.module').then(m => m.ListarProductosPageModule),

  },
  {
    path: 'reportes',
    loadChildren: () => import('./pages/reportes/reportes.module').then( m => m.ReportesPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [3] }
  },

  // Rutas compartidas (accesibles por múltiples roles)
  {
    path: 'carrito',
    loadChildren: () => import('./pages/carrito/carrito.module').then(m => m.CarritoPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [1, 2, 3] } 
  },

  {
    path: '**',
    redirectTo: 'login'
  },
  {
    path: 'splash',
    loadChildren: () => import('./pages/splash/splash.module').then( m => m.SplashPageModule)
  },







];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { 
      preloadingStrategy: PreloadAllModules,
      enableTracing: false 
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
