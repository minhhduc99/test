import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { AdminRoutingModule } from './admin-routing.module';
import { OrganizationComponent } from './organization/organization.component';
import { TeamComponent } from './team/team.component';
import { UserComponent } from './user/user.component';
import { ProjectComponent } from './project/project.component';
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './profile/profile.component';
import { ClientComponent } from './client/client.component';


@NgModule({
  declarations: [OrganizationComponent, TeamComponent, UserComponent, ProjectComponent, AboutComponent, ProfileComponent, ClientComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    TabsModule
  ]
})
export class AdminModule { }
