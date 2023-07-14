import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './components/error/404.component';
import { P500Component } from './components/error/500.component';
import { LoginComponent } from './components/login/login.component';
import { SSOLoginComponent } from './components/login/ssologin.component';
import { RegisterComponent } from './components/register/register.component';
import { SSORegisterComponent } from './components/register/ssoregister.component';
import { GetUserInfoComponent } from './components/users/get-user-info/get-user-info.component';

import { AuthGuard } from './_helpers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'sso_login',
    component: SSOLoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'sso_register',
    component: SSORegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'users/getUserInfo',
    component: GetUserInfoComponent,
    data: {
      title: 'Get User Infomation'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [    
      {
        path: 'admin',
        loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule)
      }
    ]
  },
  { path: '**', component: P404Component }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
