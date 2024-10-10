import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'carrito',
    loadChildren: () => import('./pages/carrito/carrito.module').then( m => m.CarritoPageModule),
    //canActivate: [AuthGuard]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'carrito-realtime',
    loadChildren: () => import('./pages/carrito-realtime/carrito-realtime.module').then( m => m.CarritoRealtimePageModule),
    //canActivate: [AuthGuard]
  },
  {
    path: 'detalle-carritos',
    loadChildren: () => import('./pages/detalle-carritos/detalle-carritos.module').then( m => m.DetalleCarritosPageModule),
    //canActivate: [AuthGuard]
  },
  {
    path: 'agregar-productos',
    loadChildren: () => import('./pages/agregar-productos/agregar-productos.module').then( m => m.AgregarProductosPageModule)
    //canActivate: [AuthGuard]
  },
  {
    path: 'agregar-categoria',
    loadChildren: () => import('./pages/agregar-categoria/agregar-categoria.module').then( m => m.AgregarCategoriaPageModule)
  },
  {
    path: 'listar-categorias',
    loadChildren: () => import('./pages/listar-categorias/listar-categorias.module').then( m => m.ListarCategoriasPageModule)
  },
  {
    path: 'listar-productos',
    loadChildren: () => import('./pages/listar-productos/listar-productos.module').then( m => m.ListarProductosPageModule)
  },
  {
    path: 'home-superadmin',
    loadChildren: () => import('./pages/home-superadmin/home-superadmin.module').then( m => m.HomeSuperadminPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
    //canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
