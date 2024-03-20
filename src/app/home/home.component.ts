import { Component, Input, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { interfaceHome, interfaceRecommended, interfaceSearch } from '../interfaces'
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ServicesService } from '../services.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  constructor(public http: HttpClient, public services: ServicesService, private Router: Router) {
    this.fetchedData = null;
    this.recommendedData = null;
    this.services.isSignup = false;
    this.searchData = null;
  }
  @ViewChild('form_search', { static: false }) form_search?: NgForm;

  currentCard: string = '';
  currentCardBack: string = '';
  currentCardId: number = 0;
  nextCard: number = 0;
  buttonColor: string = "#1419a6";
  cardActions: string = 'SHOW ANSWER';
  selectShape: string = 'remembershape';
  voteDiv: boolean = false;

  fetchedData: interfaceHome[] | null;
  recommendedData: interfaceRecommended[] | null;
  searchData: interfaceSearch[] | null;

  total_users: number = 0;
  total_cards: number = 0;
  total_collections: number = 0;

  searchString: string = '';
  last_time: number = 0;
  isSearchClosed: boolean = false;
  searchDataValid: boolean = false;
  searchInputClass: string = '';

  public closeSearch() {
    setTimeout(() => {
      this.searchInputClass = '';
      this.isSearchClosed = true;
    }, 100);
  }

  public searchInput() {
    this.isSearchClosed = false;
    this.searchInputClass = 'no-border-radius';
    let time: Date = new Date();
    let timestamp: number = time.getTime();
    if (timestamp - this.last_time <= 1000) {
      this.searchString = this.form_search!.value.search;
    }
    else {
      this.last_time = timestamp;
      setTimeout(() => {
        let postData: object = {
          search: this.searchString
        }
        const apiUrl: string = 'http://localhost:3000/api/search';
        this.http.post<interfaceSearch[]>(apiUrl, postData)
          .subscribe(
            (data) => {
              this.searchData = data;
              if (this.searchData.length == 0) {
                this.searchDataValid = false;
              }
              else {
                this.searchDataValid = true;
              }

            },
            (error) => {
              console.error('Error fetching data:', error);
            }
          );


      }, 1000);
      this.searchString = '';

    }
  }

  public getRecommended() {
    const apiUrl: string = 'http://localhost:3000/api/recommended';
    this.http.get<interfaceRecommended[]>(apiUrl)
      .subscribe(
        (data) => {
          this.recommendedData = data;

        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  public getHome() {
    const apiUrl: string = 'http://localhost:3000/api/home';
    this.http.get<interfaceHome[]>(apiUrl)
      .subscribe(
        (data) => {
          this.getRecommended();
          this.fetchedData = data;
          this.currentCard = data[0].front;
          this.currentCardBack = data[0].back;
          this.currentCardId = data[0].id;
          this.nextCard = 1;

          this.total_cards = data[0].total_cards;
          this.total_collections = data[0].total_collections;
          this.total_users = data[0].total_users;

        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }
  ngOnInit() {
    this.getHome();
    setTimeout(() => {
      this.services.isLoaded = true;
    }, 3000);
  }

  public changeCard(arg: string, arg2: string, arg3: number, arg4: number) {
    this.currentCard = arg;
    this.currentCardBack = arg2;
    this.nextCard = arg3 + 1;
    this.currentCardId = arg4;
    this.cardActions = "SHOW ANSWER";
    this.buttonColor = "#1419a6";
    this.voteDiv = false;
  }

  public showAnswer() {
    if (this.cardActions == "SHOW ANSWER") {
      this.currentCard = this.currentCardBack;
      this.cardActions = "NEXT";
      this.buttonColor = "#5b5b5b";
      this.voteDiv = true;
      this.services.voted = false;
    }
    else {
      if (this.fetchedData![this.nextCard] == undefined || !this.fetchedData![this.nextCard]) {
        this.currentCard = this.fetchedData![0].front;
        this.currentCardBack = this.fetchedData![0].back;
        this.currentCardId = this.fetchedData![0].id;
        this.nextCard = 1;
        this.voteDiv = false;
        this.cardActions = "SHOW ANSWER";
        this.buttonColor = "#1419a6";
      }
      else {
        this.currentCard = this.fetchedData![this.nextCard].front;
        this.currentCardBack = this.fetchedData![this.nextCard].back;
        this.currentCardId = this.fetchedData![this.nextCard].id;
        this.nextCard = this.nextCard + 1;
        this.cardActions = "SHOW ANSWER";
        this.buttonColor = "#1419a6";
        this.voteDiv = false;
      }
    }
  }
}