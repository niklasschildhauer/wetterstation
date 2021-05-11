import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms'; 
import { Router } from '@angular/router';
import { UserContextService } from 'src/app/services/user-context.service';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent implements OnInit {
  loginForm = this.formBuilder.group({
    email: new FormControl('', Validators.minLength(2)), // FIXME Validators funktionieren nicht 
    password: new FormControl('', Validators.minLength(2)),
  });

  constructor(private formBuilder: FormBuilder,
    private userContextService: UserContextService,
    private router: Router) { }

  ngOnInit(): void {
  }


  onSubmit(): void {
    console.warn('Submitted:', this.loginForm.value);
    this.userContextService.login().then(() => {
      this.router.navigateByUrl('/dashboard');
    });
  
  }

}
