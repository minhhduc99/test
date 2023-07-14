import { Component, OnInit } from '@angular/core';
import { OrganizationService, UserService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent {
  selectedOrg='';
  organizations = [];

  name: string;
  account: string;
  password: string;

  error = '';

  constructor(
    private router: Router,
    private organizationService: OrganizationService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {
    this.organizationService.getAll(null, null).subscribe(x => {
      console.log(x);
      if(x && x.data) {
        this.organizations = x.data;
      }
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
        password: this.password,
        owner_id: this.selectedOrg
      };
      this.userService.registerWithCIPAccount(user).subscribe(x => {        
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
              this.router.navigate(['/']);
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
    if(this.account && this.password && this.selectedOrg) {
      return true;
    }
    return false;
  }
}
