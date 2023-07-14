import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  username: string;
  password: string;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private toastr: ToastrService
  ) {
      // redirect to home if already logged in
      if (this.authenticationService.currentUserValue) {
          this.router.navigate(['/']);
      }
  }

  login() {
    this.submitted = true;
    this.loading = true;
    this.error = '';

    this.authenticationService.login(this.username, this.password)
        .subscribe(
            data => {
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.error = error;
                this.toastr.error(error, 'Error');
                this.loading = false;
                this.submitted = false;
            });
  }

  ngOnInit() {
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onRegister() {
    this.router.navigate(['/register']);
  }

  onForgotPassword() {
    location.href = 'http://107.113.53.44:8888/#/change-password';
    //this.router.navigate(['/']);
  }


}
