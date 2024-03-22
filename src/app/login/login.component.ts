import { Component, ViewChild } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Routes, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  constructor(private http: HttpClient, private router: Router, public services: ServicesService) {
    this.services.isSignup = true;
  }
  @ViewChild('form_login', { static: false }) form_login?: NgForm;
  displayResponse: string = '';
  buttonColor: string = 'red';

  ngOnInit() {
    if (this.services.loggedIn()) {
      this.router.navigate(['/account']);
    }
  }

  onSubmit() {
    const postData: object = {
      username: this.form_login?.value.username,
      password: this.form_login?.value.password,
    };

    const apiUrl: string = 'http://localhost:3000/api/login';

    this.http.post(apiUrl, postData, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .subscribe(
        (response: object) => {
          this.buttonColor = 'green';
          this.displayResponse = "You've logged in successfully. Redirecting to account shortly...";
          localStorage.setItem('token', String(response));
          setTimeout(() => {
            this.router.navigate(["/account"]);
            this.services.isLoaded = false;
          }, 3000);

        },
        (error) => {
          if (error.status == 401 || error.status == 422) {
            this.displayResponse = error.error;
          }
          else {
            console.error(error);
            this.displayResponse = "Something went wrong. Please contact support."
          }
        }
      );
  }
}
