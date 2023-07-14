import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganizationComponent } from './organization/organization.component';
import { TeamComponent } from './team/team.component';
import { UserComponent } from './user/user.component';
import { ProjectComponent } from './project/project.component';
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './profile/profile.component';
import { ClientComponent } from './client/client.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Admin'
    },
    children: [
      {
        path: '',
        redirectTo: 'user'
      },
      {
        path: 'organization',
        component: OrganizationComponent,
        data: {
          title: 'Organization Management'
        }
      },
      {
        path: 'team',
        component: TeamComponent,
        data: {
          title: 'Team Management'
        }
      },
      {
        path: 'user',
        component: UserComponent,
        data: {
          title: 'User Management'
        }
      }
      ,
      {
        path: 'project',
        component: ProjectComponent,
        data: {
          title: 'Project Management'
        }
      },
      {
        path: 'about',
        component: AboutComponent,
        data: {
          title: 'About'
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          title: 'My Profile'
        }
      },
      {
        path: 'client',
        component: ClientComponent,
        data: {
          title: 'Client Management'
        }
      }

    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
