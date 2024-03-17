import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  ngOnInit() {
    let token: string | null = localStorage.getItem('token');
    if (token) {
      localStorage.removeItem('token');
      window.location.replace('/');
    }
    else {
      window.location.replace('/login');
    }
  }
  constructor(private router: Router) { }

}
