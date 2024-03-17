import { Component, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { interfaceMigrations } from '../interfaces';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-migration',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterModule, CommonModule],
  templateUrl: './migration.component.html',
  styleUrl: '../account/account.component.css'
})

export class MigrationComponent {
  @ViewChild('form_migration', { static: false }) form_migration?: NgForm;
  @ViewChild('form_insert', { static: false }) form_insert?: NgForm;

  constructor(private http: HttpClient, private router: Router, public services: ServicesService) {
    this.fetchedData = null;
  }
  total: number = 0;
  fetchedData: interfaceMigrations[] | null;
  token: string | null = localStorage.getItem('token');

  onSubmit(arg: string) {
    const postData: object = {
      api_key: this.form_migration?.value.api_key,
      account: this.form_migration?.value.account,
    };

    const apiUrl: string = 'http://localhost:3000/api/migration';

    this.http.post<interfaceMigrations[]>(apiUrl, postData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${this.token}`,
      }
    })
      .subscribe(
        (response) => {
          this.total = response.length;
          if (this.total == 0) {
            this.services.msgModal("No matching records to migrate.", false);
            this.fetchedData = null;
          }
          else {
            this.fetchedData = response;
          }
        },
        (error) => {
          console.log(error);
          if (error.status == 401) {
            this.services.msgModal("Missing/Invalid credentials.", false);
          }
          else if (error.status == 422) {
            this.services.msgModal(error.error, false);
          }
          else {
            this.services.msgModal("Something went wrong. Please contact support.", false);
          }
          this.fetchedData = null;
        }
      );
  }

  public migrationSubmit(arg: Object) {
    const apiUrl: string = 'http://localhost:3000/api/migration/insert';

    const postData: object = {
      data: arg,
      is_public: this.form_insert?.value.is_public,
      collection: this.form_insert?.value.collection_settings,
    }

    this.http.post<object[]>(apiUrl, postData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${this.token}`,
      }
    })
      .subscribe(
        (response) => {
          this.services.msgModal("Migration submitted successfully. Please check your account shortly.", true);
        },
        (error) => {
          console.log(error);
          if (error.status == 422) {
            this.services.msgModal(error.error, false);
          }
          else {
            this.services.msgModal("Something went wrong. Please contact support.", false);
          }
        }
      );
  }
}
