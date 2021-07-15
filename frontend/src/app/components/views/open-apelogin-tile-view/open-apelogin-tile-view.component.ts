import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms'; 
import { UserContextService } from 'src/app/services/user-context.service';

/**
 * Open APE login view component
 * 
 * Display two form controls to enter the username and password of 
 * open ape to load the user context from it.
 */
@Component({
  selector: 'app-open-apelogin-tile-view',
  templateUrl: './open-apelogin-tile-view.component.html',
  styleUrls: ['./open-apelogin-tile-view.component.scss']
})
export class OpenAPELoginTileViewComponent implements OnInit {
  loginForm = this.formBuilder.group({
    username: new FormControl('', Validators.minLength(2)), // FIXME Validators funktionieren nicht 
    password: new FormControl('', Validators.minLength(2)),
  });
  error?: string;

  constructor(
    private formBuilder: FormBuilder,
    private userContextService: UserContextService) { }

  ngOnInit(): void {
  }

  /**
   * Triggers the login process of open APE 
   */
  onSubmit(): void {
    const username = this.loginForm.get("username")?.value;
    const password = this.loginForm.get("password")?.value;
    this.error = undefined;

    this.loginToOpenApe(username, password);
  }

  /**
   * Uses the user context service to log the user to open
   * ape in 
   * 
   * @param username 
   * @param password 
   */
  loginToOpenApe(username: string, password: string) {
    this.error = undefined
    this.userContextService.loginToOpenApe(username, password).then(result => {
      if(!result.success) {
        this.error = result.error
      } 
    })
  }
}
