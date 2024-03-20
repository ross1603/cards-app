import { Component, Input } from '@angular/core';
import { RouterOutlet, RouterModule, Routes, Router } from '@angular/router';
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
  constructor(public services: ServicesService, private http: HttpClient, private router: Router) {
    this.services.isAccount = false;
    this.services.isLogged = this.services.loggedIn();
  }

  ngOnInit() {
    if (this.services.loggedIn()) {
      this.services.getAnalyticsSidebar();
    }
    setTimeout(() => {
      this.services.isLoaded = true;
    }, 3000);
  }
}