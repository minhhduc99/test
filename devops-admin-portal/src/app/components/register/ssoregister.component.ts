import { Component, OnInit } from '@angular/core';
import { OrganizationService, UserService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { KeycloakService } from 'keycloak-angular';


@Component({
  selector: 'app-dashboard',
  templateUrl: './ssoregister.component.html',
  styleUrls: ['./ssoregister.component.css']
})
export class SSORegisterComponent implements OnInit {
  selectedOrg='';
  organizations = [];

  name: string;
  account: string;
  email: string;
  token: string;

  error = '';

  constructor(
    private router: Router,
    private organizationService: OrganizationService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
    private keycloakService: KeycloakService
  ) {
    this.organizationService.getAll(null, null).subscribe(x => {
      console.log(x);
      if(x && x.data) {
        this.organizations = x.data;
      }
    });
    this.keycloakService.isLoggedIn().then(async (isLoggedIn) => {
      if(isLoggedIn) {
        try {
          // update user profile if authenticated
          let userProfile = await keycloakService.loadUserProfile();
          console.log(userProfile);
          this.account = userProfile.username;
          this.email = userProfile.email;
          this.name = userProfile.firstName + ' ' + userProfile.lastName;
          this.token = await keycloakService.getToken();
        } catch (e) {
          console.log('exception ' + e);
        }

      } else {
        console.log('not authenticated!');

      }

    }).catch((e) => {
      console.log('authenticate error: ' + e);
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    if(this.validate()) {
      this.error = '';
      let user = {
        name: this.name,
        account: this.account,
        email: this.email,
        owner_id: this.selectedOrg,
        token: this.token
      };
      this.userService.registerWithSSOAccount(user).subscribe(x => {
        if(!x || x.result == 'error') {
          this.error = x.message;
          this.toastr.error(x.message, 'Error');
        } else {
          // success
          let user = x;
          if (user && user.token) {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.authenticationService.reloadUser();
              location.href = window.location.origin;
              //this.router.navigate(['/']);
          }

        }
      }, error => {
        this.error = 'Error: ' + error;
        this.toastr.error('Error: ' + error, 'Error');
      });
    } else {
      this.error = 'Please input all required fields';
      this.toastr.error('Please input all required fields', 'Error');
    }
  }

  validate() {
    if(this.account && this.selectedOrg) {
      return true;
    }
    return false;
  }
}
