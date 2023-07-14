import {Component, OnDestroy } from '@angular/core';
import { navItems } from '../../_nav';
import { AuthenticationService, OrganizationService, AppMessageService } from '../../services';
import { User, Role } from '../../_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;

  user: User;
  avatarUrl = 'assets/img/avatars/default.png';
  userName = '';

  currentOrganization = -1;
  organizations = [{
    id: -1,
    name: 'All'
  }];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private organizationService: OrganizationService,
    private appMessageService: AppMessageService
  ) {
      this.authenticationService.currentUser.subscribe(x => {
        console.log(x);
        this.user = x;
        if(x) {
          this.userName = x.name;
          if(x.avatar) {
            this.avatarUrl = 'assets/img/avatars/' + x.avatar;
          }
          if(this.isSAdmin()) {
            this.organizationService.getAll(null, null).subscribe(x => {
              if(x && x.data) {
                this.organizations = [{
                id: -1,
                name: 'All'
              }].concat(x.data);
              }
            });
          }
        }

      });
      localStorage.setItem('currentOrganization', '-1');
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  isSAdmin() {
    return this.user.role == Role.SAdmin;
  }

  onOrgChange(org) {    
    localStorage.setItem('currentOrganization', org);
    this.appMessageService.sendInAppMessageWithData(AppMessageService.TYPE_SADMIN_ORGANIZATION_CHANGED, org);
  }
}
