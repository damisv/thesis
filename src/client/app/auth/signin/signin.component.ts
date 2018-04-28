import {AfterContentInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Account} from '../../models/account';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styles: []
})
export class SigninComponent implements OnInit {
  loginGroup: FormGroup;
  returnUrl: string;
  hide = true;
  // Properties
  account: Account = new Account('', '');

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private _formBuilder: FormBuilder) {}

  submit() {
    this.authService.signIn(this.account)
        .subscribe( res => {
          localStorage.setItem('token', res.token);
          this.router.navigate([this.returnUrl]);
        });
  }

  ngOnInit() {
    this.loginGroup = this._formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required]
    });
    // localStorage.removeItem('token');
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/app';
  }

  setEmailFieldError() {
    return this.loginGroup.get('email').hasError('required') ? 'This field is required' :
      (this.loginGroup.get('email').hasError('email') ? 'Not a valid email' : '');
  }
}
