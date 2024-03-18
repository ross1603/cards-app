import { Component, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { Router } from '@angular/router';
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
            console.log(`Error: ` + error);
            this.displayResponse = "Something went wrong. Please contact support.";
          }
        }
      );
  }
}