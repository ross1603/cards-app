import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  constructor(private router: Router, private services: ServicesService) { }
  ngOnInit() {
    if (this.services.loggedIn()) {
      localStorage.removeItem('token');
      this.router.navigate(['/']);
    }
    else {
      this.router.navigate(['/login']);
    }
  }
}
