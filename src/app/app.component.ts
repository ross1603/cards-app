import { Component, Input } from '@angular/core';
import { RouterOutlet, RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ServicesService } from './services.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AccountComponent, CommonModule, HomeComponent, RouterModule, HttpClientModule],
  templateUrl: './app.component.html',
  providers: [ServicesService],
  styleUrl: './app.component.css',
})

export class AppComponent {
  constructor(public services: ServicesService, private http: HttpClient) {
  }
  isSignup: boolean = false;
  isLoaded: boolean = false;
  isAccount: boolean = false;
  currentUrl = (window.location.href).split('/');
  isLogged: boolean = false;

  ngOnInit() {
    this.services.getAnalyticsSidebar();

    if (this.currentUrl[3] == "login" || this.currentUrl[3] == "register") {
      this.isSignup = true;
    }
    if (this.currentUrl[3] == "account" || this.currentUrl[3] == "migration") {
      this.isAccount = true;
    }

    let token: string | null = localStorage.getItem('token');
    if (token) {
      this.isLogged = true;
    }
    else {
      this.isLogged = false;
    }
    setTimeout(() => {
      this.isLoaded = true;
    }, 0);
  }
}