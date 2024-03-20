import { Component, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { interfaceAccount, interfaceUnique, interfaceMigrations, interfaceAnalyticsDashboard } from '../interfaces';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})

export class AccountComponent {
  constructor(public http: HttpClient, private router: Router, public services: ServicesService) {
    this.services.isAccount = true;
    this.services.isLogged = true;
    this.services.isSignup = false;
    this.fetchedData = null;
    this.uniqueObjects = null;
    this.migrationObjects = null;
    this.analyticsDashboardObjects = null;
    this.migrationItem = 0;
  }

  ngOnDestroy() {
    this.services.isAccount = false;
  }

  @ViewChild('form_add_card', { static: false }) form_add_card?: NgForm;
  @ViewChild('form_add_collection', { static: false }) form_add_collection?: NgForm;
  @ViewChild('form_analytics_dashboard', { static: false }) form_analytics_dashboard?: NgForm;
  @ViewChild('form_edit_collection', { static: false }) form_edit_collection?: NgForm;
  @ViewChild('form_edit_card', { static: false }) form_edit_card?: NgForm;

  isVisibleCards: boolean = true;
  isVisibleCollections: boolean = false;
  isVisibleMigrations: boolean = false;
  isVisibleSide: boolean = true;
  isVisibleAddCard: boolean = false;
  isVisibleAddCollection: boolean = false;
  noItemsMsg: string = '';
  noItemsMsgCollections: string = '';
  selectedCategory: string = 'No data yet.';

  successCount: number = 0;
  missedCount: number = 0;
  mixedCount: number = 0;
  noneCount: number = 0;
  successHeight: string = '5%';
  missedHeight: string = '5%';
  mixedHeight: string = '5%';
  noneHeight: string = '5%';
  modalEditCard: boolean = false;
  modalEditCollection: boolean = false;
  modalDelete: boolean = false;

  paramAction: string = '';
  paramType: string = '';
  paramId: number | string = 0;

  public passParams(arg: string, arg2: string, arg3: number | string) {
    this.paramAction = arg;
    this.paramType = arg2;
    this.paramId = arg3;

    if (arg == "delete") {
      this.modalDelete = true;
    }
    else if (arg == "edit") {
      if (arg2 == "card") {
        this.modalEditCard = true;
      }
      else if (arg2 == "collection") {
        this.modalEditCollection = true;
      }
    }
  }

  public modalVisibility(arg: string) {
    if (arg == "card") {
      this.modalEditCard = !this.modalEditCard;
    }
    else if (arg == "collection") {
      this.modalEditCollection = !this.modalEditCollection
    }
    else if (arg == "delete") {
      this.modalDelete = !this.modalDelete;
    }
  }

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
  analyticsDashboardObjects: interfaceAnalyticsDashboard[] | null
  migrationItem: string | number;
  token: string | null = localStorage.getItem('token');

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

          if (this.fetchedData.length == 0 || this.uniqueObjects.length == 0 || !this.fetchedData || !this.uniqueObjects) {
          }
          else {
            this.analyticsDashboard(this.uniqueObjects[this.uniqueObjects.length - 1].id);
          }

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

          if (this.fetchedData.length == 0 || !this.fetchedData) {
            this.toggleVisibility("cards");
            this.noItemsMsg = `You don't have any cards yet.`;
          }
          if (this.uniqueObjects.length == 0 || !this.uniqueObjects) {
            this.noItemsMsgCollections = `You don't have any collections yet.`;
          }
        },
        (error) => {
          console.error('POST error:', error);
          this.router.navigate(['/logout']);
        }
      );
  }

  // ANALYTICS DASHBOARD

  public analyticsDashboard(arg: number) {
    this.successCount = 0;
    this.missedCount = 0;
    this.mixedCount = 0;
    this.noneCount = 0;

    let collection_id: number = arg
    if (arg == 0) {
      collection_id = this.form_analytics_dashboard?.value.collection_id;
    }
    const postData: object = {
      collection_id: collection_id,
    };
    const apiUrl: string = 'http://localhost:3000/api/account/analytics';

    this.http.post<interfaceAnalyticsDashboard[]>(apiUrl, postData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${this.token}`
      }
    })
      .subscribe(
        (response) => {
          this.analyticsDashboardObjects = response;
          this.selectedCategory = response[0].collection_name;
          console.log(this.analyticsDashboardObjects);

          for (let i = 0; i < this.analyticsDashboardObjects.length; i++) {
            if (this.analyticsDashboardObjects[i].total_votes == 0) {
              this.noneCount += 1;
            }
            else if (this.analyticsDashboardObjects[i].total_positive_votes == this.analyticsDashboardObjects[i].total_votes) {
              this.successCount += 1;
            }
            else if (this.analyticsDashboardObjects[i].total_positive_votes < this.analyticsDashboardObjects[i].total_votes && this.analyticsDashboardObjects[i].total_positive_votes >= 1) {
              this.mixedCount += 1;
            }
            else if (this.analyticsDashboardObjects[i].total_positive_votes == 0 && this.analyticsDashboardObjects[i].total_votes >= 1) {
              this.missedCount += 1;
            }
          }

          this.successHeight = `${Math.round((this.successCount / this.analyticsDashboardObjects.length) * 100)}%`;
          this.missedHeight = `${Math.round((this.missedCount / this.analyticsDashboardObjects.length) * 100)}%`;
          this.mixedHeight = `${Math.round((this.mixedCount / this.analyticsDashboardObjects.length) * 100)}%`;
          this.noneHeight = `${Math.round((this.noneCount / this.analyticsDashboardObjects.length) * 100)}%`;

          if (this.successHeight == '0%') {
            this.successHeight = '5%';
          }
          if (this.missedHeight == '0%') {
            this.missedHeight = '5%';
          }
          if (this.mixedHeight == '0%') {
            this.mixedHeight = '5%';
          }
          if (this.noneHeight == '0%') {
            this.noneHeight = '5%';
          }
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
            this.services.msgModal(`The ${type} is successfully deleted.`, true);
          }
        },
        (error) => {
          this.services.msgModal("Something went wrong. Please contact support.", false);
          console.error('POST error:', error);
        }
      );
    this.modalDelete = false;
  }

  // Edit requests.

  editItem(type_arg: string | number, arg: string | number): void {
    const number: number = Number(arg);
    const type: string = String(type_arg);

    let front: string | null = this.form_edit_card?.value.edit_front;
    let back: string | null = this.form_edit_card?.value.edit_back;
    let name: string | null = this.form_edit_collection?.value.collection_name;

    const postData: object = {
      id: number,
      front: front,
      type: type,
      back: back,
      name: name,
    };
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
          this.services.msgModal(`The ${type} is successfully edited.`, true);
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

    if (front) {
      this.modalEditCard = false;
    }
    else {
      this.modalEditCollection = false;
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
