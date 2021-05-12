import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms'; 
import { Router } from '@angular/router';
import { UserContextService } from 'src/app/services/user-context.service';

@Component({
  selector: 'app-registration-view',
  templateUrl: './registration-view.component.html',
  styleUrls: ['./registration-view.component.scss']
})
export class RegistrationViewComponent implements OnInit {
  registrationForm = this.formBuilder.group({
    email: new FormControl('', Validators.minLength(2)), // FIXME Validators funktionieren nicht 
    password: new FormControl('', Validators.minLength(2)),
    repeatedPassword: new FormControl('', Validators.minLength(2)),
    username: new FormControl('', Validators.minLength(2)),
  });

  constructor(private formBuilder: FormBuilder,
    private userContextService: UserContextService,
    private router: Router) { }

  ngOnInit(): void {
  }


  onSubmit(): void {
    console.warn('Submitted:', this.registrationForm.value);
    this.userContextService.login().then(() => {
      this.router.navigateByUrl('/dashboard');
    });
  
  }
}
