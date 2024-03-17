import { Component, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  @ViewChild('form_login', { static: false }) form_login?: NgForm;
  displayResponse: string = '';
  buttonColor: string = 'red';

  ngOnInit() {
    let token: string | null = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/account']);
    }
  }
  constructor(private http: HttpClient, private router: Router) { }

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
          this.buttonColor='green';
          this.displayResponse = "You've logged in successfully. Redirecting to account shortly...";
          localStorage.setItem('token', String(response));
          setTimeout(() => {
            window.location.replace("/account");
          }, 3000);

        },
        (error) => {
          if (error.status == 401 || error.status == 422) {
            this.displayResponse = error.error;
          }
          else {
            console.log(error);
            this.displayResponse = "Something went wrong. Please contact support."
          }
        }
      );
  }
}
