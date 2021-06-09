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
    password: new FormControl('', Validators.minLength(2)),
    repeatedPassword: new FormControl('', Validators.minLength(2)),
    username: new FormControl('', Validators.minLength(2)),
  });
  error?: string;

  constructor(private formBuilder: FormBuilder,
    private userContextService: UserContextService,
    private router: Router) { }

  ngOnInit(): void {
  }


  onSubmit(): void {
    const username = this.registrationForm.get("username")?.value;
    const password = this.registrationForm.get("password")?.value;
    const repeatedpassword = this.registrationForm.get("repeatedPassword")?.value;

    if(password !== repeatedpassword) {
      this.error = "Das Passwort stimmt nicht überein"
      return
    }
    
    this.error = undefined;
    this.userContextService.register(password, username).then((data) => {
      if(data.success) {
        this.router.navigateByUrl('/onboarding/personalization');
      } else {
        this.error = data.error
      }
    });
  }
}
