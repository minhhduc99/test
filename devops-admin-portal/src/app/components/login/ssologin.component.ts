import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { AuthenticationService } from '../../services/authentication.service';


@Component({
  selector: 'app-ssologin',
  templateUrl: './ssologin.component.html',
  styleUrls: ['./ssologin.component.css']
})
export class SSOLoginComponent implements OnInit {

  message = 'checking SSO status ...'
  isLoggingIn = true;

  constructor( private router: Router,
    private keycloakService: KeycloakService,
    private authenticationService: AuthenticationService ) {
    this.keycloakService.isLoggedIn().then(async (isLoggedIn) => {
      if(isLoggedIn) {
        try {
          // update user profile if authenticated
          let userProfile = await keycloakService.loadUserProfile();
          console.log(userProfile);
          authenticationService.loginSSO(userProfile.username, await keycloakService.getToken()).subscribe(
            data => {
              this.message = 'SSO authenticated!';
              console.log('login success ' + data);
              this.router.navigate(['/']);
            },
            error => {
              this.message = 'Please register new DAP account for \'' + userProfile.username + '\' SSO account';
              this.isLoggingIn = false;
              console.log('login error ' + error);
            }
          );
        } catch (e) {
          console.log('exception ' + e);
        }

      } else {
        console.log('not authenticated!');
        this.message = 'Failed to authenticated using SSO. Please select a login option';
      }

    }).catch((e) => {
      console.log('authenticate error: ' + e);
      this.message = 'Failed to authenticated using SSO. Please select a login option';
    });

  }

  ngOnInit() {
  }

  loginLocal() {
    this.router.navigate(['/login']);
  }

  loginSSO() {
    this.keycloakService.login({redirectUri: window.location.origin});
  }

  logoutSSO() {
    this.keycloakService.logout(window.location.origin);
  }

  registerSSO() {
    this.router.navigate(['/sso_register']);
  }

}
