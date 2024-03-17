import { Component, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { interfaceAccount, interfaceUnique, interfaceMigrations } from '../interfaces';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})

export class AccountComponent {
  @ViewChild('form_add_card', { static: false }) form_add_card?: NgForm;
  @ViewChild('form_add_collection', { static: false }) form_add_collection?: NgForm;
  @ViewChild('form_analytics_dashboard', { static: false }) form_analytics_dashboard?: NgForm;

  isVisibleCards: boolean = true;
  isVisibleCollections: boolean = false;
  isVisibleMigrations: boolean = false;
  isVisibleSide: boolean = true;
  isVisibleAddCard: boolean = false;
  isVisibleAddCollection: boolean = false;
  noItemsMsg: string = '';

  toggleVisibility(arg: string) {
    if (arg == "cards") {
      this.isVisibleCards = !this.isVisibleCards;
    }
    else if (arg == "collections") {
      this.isVisibleCollections = !this.isVisibleCollections;
    }
    else if (arg == "migrations") {
      this.isVisibleMigrations = !this.isVisibleMigrations;
    }
    else if (arg == "switchSide") {
      this.isVisibleSide = !this.isVisibleSide;
    }
    else if (arg == "addcard") {
      this.isVisibleAddCard = !this.isVisibleAddCard;
      this.isVisibleAddCollection = false;
    }
    else if (arg == "addcollection") {
      this.isVisibleAddCollection = !this.isVisibleAddCollection;
      this.isVisibleAddCard = false;
    }
  }

  fetchedData: interfaceAccount[] | null;
  uniqueObjects: interfaceUnique[] | null
  migrationObjects: object[] | null;
  migrationItem: string | number;
  token: string | null = localStorage.getItem('token');

  constructor(public http: HttpClient, private router: Router, public services: ServicesService) {
    this.fetchedData = null;
    this.uniqueObjects = null;
    this.migrationObjects = null;
    this.migrationItem = 0;
  }
  ngOnInit() {
    const apiUrl: string = 'http://localhost:3000/api/account';
    const postData: object = {
      token: this.token,
    };

    this.http.post<interfaceAccount[]>(apiUrl, postData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${this.token}`,
      }
    })
      .subscribe(
        (response) => {
          this.fetchedData = response;

          let uniqueObjects: Object[] = [];
          let seenNames = new Set<string>();

          for (const obj of this.fetchedData) {
            if (!seenNames.has(obj.name || "")) {
              uniqueObjects.push(obj);
              seenNames.add(obj.name || "");
            }
          }

          type UniqueObject = {
            id: number;
            name: string;
          };

          this.uniqueObjects = uniqueObjects as UniqueObject[];
          for (let j = 0; j < this.fetchedData.length; j++) {
            if (this.fetchedData[j].front == null) {
              this.fetchedData.splice(j, this.fetchedData.length);
            }
          }

          this.analyticsDashboard(this.uniqueObjects[this.uniqueObjects.length - 1].id);

          this.uniqueObjects = this.uniqueObjects.slice().reverse();

          let arrayMigrations: Object[] = [];
          for (let i = 0; i < response.length; i++) {
            if (response[i].migration_id != 1) {
              arrayMigrations.push(response[i].migration_id);
            }
          }


          this.migrationObjects = Array.from(new Set(arrayMigrations));
          if (this.migrationObjects.length == 0) {
            this.migrationObjects = null;
          }

          this.migrationItem = String(this.migrationObjects);

          if (this.fetchedData.length == 0 || this.uniqueObjects.length == 0) {
            this.toggleVisibility("cards");
            this.noItemsMsg = 'No items to display.';
          }
        },
        (error) => {
          console.error('POST error:', error);
          window.location.replace('/logout');
        }
      );
  }

  // ANALYTICS DASHBOARD

  public analyticsDashboard(arg: number) {
    let collection_id: number = arg
    if (arg == 0) {
      collection_id = this.form_analytics_dashboard?.value.collection_id;
    }
    const postData: object = {
      collection_id: collection_id,
    };
    const apiUrl: string = 'http://localhost:3000/api/account/analytics';

    this.http.post(apiUrl, postData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${this.token}`
      }
    })
      .subscribe(
        (response: object) => {
          console.log(response);
        },
        (error) => {
          this.services.msgModal("Something went wrong. Please contact support.", false);
          console.error('POST error:', error);

        }
      );
  }

  // Delete requests.

  removeItem(type_arg: string | number, id_arg: string | number): void {
    const id: number = Number(id_arg);
    const type: string = String(type_arg);

    if (confirm("This action cannot be reversed. Are you sure you want to proceed?")) {
      const apiUrl: string = 'http://localhost:3000/api/delete/' + type + '/' + id;
      this.http.delete<Object>(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${this.token}`,
        }
      })
        .subscribe(
          (response) => {
            console.log(response);
            if (type == "user") {
              localStorage.removeItem('token');
              this.router.navigate(['/']);
            }
            else {
              this.ngOnInit();
            }
          },
          (error) => {
            this.services.msgModal("Something went wrong. Please contact support.", false);
            console.error('POST error:', error);
          }
        );

    }
  }

  // Edit requests.

  editItem(type_arg: string | number, arg: string | number): void {
    const number: number = Number(arg);
    const type: string = String(type_arg);
    let proceed: number = 0;

    let front: string | null = '';
    let back: string | null = '';
    let name: string | null = '';

    if (type == "card") {
      front = prompt("Please enter new value for Front:", "");
      if (front == null || front == "") {
      }
      else {
        back = prompt("Please enter new value for Back:", "");
        if (back == null || back == "") {
        }
        else {
          if (confirm(`Are you sure you want to proceed?`)) {
            proceed = 1;
          }
        }
      }
    }
    else if (type == "collection") {
      name = prompt("Please enter new collection name:", "");
      if (name == null || name == "") {
      }
      else {
        proceed = 1;
      }
    }
    const postData: object = {
      id: number,
      front: front,
      type: type,
      back: back,
      name: name,
    };
    if (proceed == 1) {
      const apiUrl: string = 'http://localhost:3000/api/update';

      this.http.patch<Object>(apiUrl, postData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${this.token}`
        }
      })
        .subscribe(
          (response) => {
            this.ngOnInit();
          },
          (error) => {
            if (error.status == 422) {
              this.services.msgModal(error.error, false);
            }
            else {
              console.error('POST error:', error);
              this.services.msgModal("Something went wrong. Please contact support.", false);
            }
          }
        );
    }
    else {
      this.services.msgModal("Fields cannot be empty. Please try again.", false);
    }
  }

  // Insert actions

  onSubmitInsert(arg: string) {
    let postData: object = {};
    if (arg == 'form_add_card') {
      postData = {
        front: this.form_add_card?.value.front,
        back: this.form_add_card?.value.back,
        is_public: this.form_add_card?.value.is_public,
        collection_id: this.form_add_card?.value.collection_id
      }
    }
    else if (arg == 'form_add_collection') {
      postData = {
        collection_name: this.form_add_collection?.value.collection_name
      }
    }
    else {
      this.services.msgModal("Something went wrong. Please contact support.", false);
    }

    const apiUrl: string = 'http://localhost:3000/api/insert';

    this.http.post(apiUrl, postData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${this.token}`
      }
    })
      .subscribe(
        (response: object) => {
          console.log(response);
          this.services.msgModal("Submitted successfully.", true);
          this.form_add_card?.reset();
          this.form_add_collection?.reset();
          this.ngOnInit();
        },
        (error) => {
          if (error.status == 422) {
            this.services.msgModal(error.error, false);
          }
          else {
            this.services.msgModal("Something went wrong. Please contact support.", false);
            console.error('POST error:', error);
          }
        }
      );
  }
}
