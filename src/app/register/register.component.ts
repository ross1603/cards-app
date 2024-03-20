import { Component, ViewChild } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Routes, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  constructor(private http: HttpClient, private router: Router, public services: ServicesService) {
    this.services.isSignup = true;
  }

  @ViewChild('form_register', { static: false }) form_register?: NgForm;
  displayResponse: string = '';
  buttonColor: string = 'red';
  rvColorL: string = 'grey';
  rvColorU: string = 'grey';
  rvColorN: string = 'grey';
  rvColorS: string = 'grey';
  rvColor8: string = 'grey';

  showValidations: boolean = false;

  passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$/;

  passwordCheck() {
    let password: string = this.form_register?.value.password;
    let hasLowercaseRegex: RegExp = /[a-z]/;
    let hasUppercaseRegex: RegExp = /[A-Z]/;
    let hasNumberRegex: RegExp = /[0-9]/;
    let hasSymbolRegex: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (password.length < 8) {
      this.rvColor8 = 'grey';
    }
    else {
      this.rvColor8 = 'green';
    }

    if (hasLowercaseRegex.test(password)) {
      this.rvColorL = 'green';
    }
    else {
      this.rvColorL = 'grey';
    }

    if (hasUppercaseRegex.test(password)) {
      this.rvColorU = 'green';
    }
    else {
      this.rvColorU = 'grey';
    }

    if (hasNumberRegex.test(password)) {
      this.rvColorN = 'green';
    }
    else {
      this.rvColorN = 'grey';
    }

    if (hasSymbolRegex.test(password)) {
      this.rvColorS = 'green';
    }
    else {
      this.rvColorS = 'grey';
    }
  }

  ngOnInit() {
    if (this.services.loggedIn()) {
      this.router.navigate(['/account']);
    }
  }
  onSubmit() {
    const postData: object = {
      username: this.form_register?.value.username,
      password: this.form_register?.value.password,
    };

    const apiUrl: string = 'http://localhost:3000/api/register';

    this.http.post(apiUrl, postData, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .subscribe(
        (response: object) => {
          this.buttonColor = 'green';
          this.displayResponse = "Successfully registered ! Redirecting to login shortly...";
          setTimeout(() => {
            this.router.navigate(["/login"]);
          }, 3000);
        },
        (error) => {
          console.error('POST error:', error);
          if (error.status == 422) {
            this.displayResponse = error.error;
          }
          else {
            console.error(`Error: ` + error);
            this.displayResponse = "Something went wrong. Please contact support.";
          }
        }
      );
  }
}
