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
    username: new FormControl('', Validators.minLength(2)), // FIXME Validators funktionieren nicht 
    password: new FormControl('', Validators.minLength(2)),
  });

  error?: string;

  constructor(private formBuilder: FormBuilder,
    private userContextService: UserContextService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const username = this.loginForm.get("username")?.value;
    const password = this.loginForm.get("password")?.value;
    this.error = undefined;

    this.userContextService.login(username, password).then((data) => {
      if(data.success) {
        this.router.navigateByUrl('/dashboard');
      } else {
        this.error = data.error;
      }
    },
    (error) => {
      this.error = error;
    });
  }

  onClickRegistration() {
    this.userContextService.logout();
    this.router.navigateByUrl('/onboarding/registration');
  }

  onClickPersonalization() {
    this.userContextService.disableLogin = true;
    this.router.navigateByUrl('/onboarding/personalization');
  }
}
