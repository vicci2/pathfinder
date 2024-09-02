import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auths/components/register/register.component';
import { LoginComponent } from './auths/components/login/login.component';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './templates/dashboard/dashboard.component';
import { ResetOpsComponent } from './auths/components/reset-ops/reset-ops.component';
import { FirstLoginComponent } from './templates/first-login/first-login.component';
import { PlaceAutocompleteComponent } from './templates/map/place-autocomplete/place-autocomplete.component';

const routes: Routes = [{
  path:'',
  pathMatch:'full',
  redirectTo:'dashboard'
},
/* {
path: 'base',
loadChildren: () => import('./auths/components/base/base.module').then(m => m.baseModule)
}, */

{path:'signUp',
component:RegisterComponent},

{path:'login',
component:LoginComponent},

{path:'firstLogin',
component:FirstLoginComponent},

{path:'home',
component:PlaceAutocompleteComponent},

{path:'dashboard',
component:DashboardComponent},

{path:'reset/:email',
component:ResetOpsComponent},

]

@NgModule({
  imports: [CommonModule,RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
