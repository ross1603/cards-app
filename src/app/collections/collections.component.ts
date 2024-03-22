import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { interfaceCollections, interfaceRecommended } from '../interfaces';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css'
})
export class CollectionsComponent {
  constructor(public http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router, public services: ServicesService) {
    this.fetchedData = null;
    this.recommendedData = null;
    this.placeholders = null;
  }

  fetchedData: interfaceCollections[] | null;
  recommendedData: interfaceRecommended[] | null;

  link: string = "collections";
  collectionTitle: string = '';
  showAll: boolean = true;
  pagesTotal: number = 0;
  placeholders: Array<number> | null;

  currentCard: string = '';
  currentCardBack: string = '';
  currentCardId: number = 0;
  nextCard: number = 0;
  buttonColor: string = "#1419a6";
  cardActions: string = 'SHOW ANSWER';
  voteDiv: boolean = false;
  isPage: string | null | number = Number(this.activatedRoute.snapshot.paramMap.get('id3'));


  ngOnInit() {
    let col_id: string | null = this.activatedRoute.snapshot.paramMap.get('id');
    let isFocus: string | null | number = this.activatedRoute.snapshot.paramMap.get('id2');
    let isPage = Number(this.activatedRoute.snapshot.paramMap.get('id3'));

    if (!isFocus) {
      isFocus = 0;
    }
    let apiUrl: string = 'http://localhost:3000/api/collections';
    if (col_id && Number(col_id) > 0) {
      this.showAll = false;
      this.link = "card";
    }
    else {
      col_id = "0";
    }
    const postData: object = {
      col_id: col_id,
      focus: isFocus,
      page: isPage,
    };
    let headers: object;
    const token: string | null = localStorage.getItem('token');
    if (token) {
      headers = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        }
      }
    }
    else {
      headers = {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    }
    this.http.post<interfaceCollections[]>(apiUrl, postData, headers)
      .subscribe(
        (response) => {
          if (isPage != null && response.length == 0) {
            this.router.navigate(['/collections']);
          }
          this.getRecommended();
          this.fetchedData = response;
          this.currentCard = response[0].front;
          this.currentCardBack = response[0].back;
          this.currentCardId = response[0].id;
          this.nextCard = 1;
          this.pagesTotal = Math.ceil(response[0].total / 8);
          if (col_id && Number(col_id) > 0) { }
          else {
            this.placeholders = new Array(this.pagesTotal);
          }
          if (col_id != "0") {
            this.collectionTitle = `► ${response[0].collection_name}`;
          }
        },
        (error) => {
          console.error(error);
          this.router.navigate(['/account']);
          if (token) {
            this.services.msgModal("No cards to display, please add cards first.", false);
          }
        }
      );
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
        this.buttonColor = "#1419a6";
        this.cardActions = 'SHOW ANSWER';
        this.voteDiv = false;
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
