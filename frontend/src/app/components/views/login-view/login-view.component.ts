import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms'; 
import { Router } from '@angular/router';
import { UserContextService } from 'src/app/services/user-context.service';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent implements OnInit {
  loginForm = this.formBuilder.group({
    email: new FormControl('', Validators.minLength(2)), // FIXME Validators funktionieren nicht 
    password: new FormControl('', Validators.minLength(2)),
  });

  error?: string;

  constructor(private formBuilder: FormBuilder,
    private userContextService: UserContextService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log('Submitted:', this.loginForm.value);
    this.userContextService.login().then(() => {
      this.router.navigateByUrl('/dashboard');
    });
  }

  onClickRegistration() {
    this.userContextService.logout();
    this.router.navigateByUrl('/onboarding/registration');
  }

  onClickPersonalization() {
    this.router.navigateByUrl('/onboarding/personalization');
  }
}
