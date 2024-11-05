import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeSuperadminPage } from './home-superadmin.page';

const routes: Routes = [
  {
    path: '',
    component: HomeSuperadminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeSuperadminPageRoutingModule {}
