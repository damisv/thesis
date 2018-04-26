import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {Account} from '../../models/account';
import {User} from '../../models/user';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: []
})
export class SignupComponent implements OnInit {
    // signUpForm: FormGroup;
  hide = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  // User properties
  account: Account = new Account('', '');
  user: User = new User('');

    constructor(private authService: AuthService,
                private router: Router,
                private _formBuilder: FormBuilder) {}
  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required, Validators.minLength(6)]],
      'retypePassword': ['', [Validators.required, Validators.minLength(6)]]
    });
    this.secondFormGroup = this._formBuilder.group({
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required]
    });
  }
  // Public Methods
  emailChanged() {
      this.user.email = this.account.email = this.firstFormGroup.get('email').value;
  }
  setEmailFieldError() {
    return this.firstFormGroup.get('email').hasError('required') ? 'This field is required' :
      (this.firstFormGroup.get('email').hasError('email') ? 'Not a valid email' : '');
  }
  checkPassMismatch() {
      const retype = this.firstFormGroup.get('retypePassword');
      const pass = this.firstFormGroup.get('password');
      if (retype.value !== pass.value) {
        retype.setErrors({mismatch: true});
      } else {
        retype.setErrors(null);
      }
  }
  submit() {
      // TODO: send User profile too.
    this.authService.signUp(this.account)
      .then( _ => this.router.navigate(['/auth/signin']) );
  }
}
