import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
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
  fetchedData: interfaceCollections[] | null;
  recommendedData: interfaceRecommended[] | null;

  link: string = "collections";
  collectionTitle: string = '';
  showAll: boolean = true;

  currentCard: string = '';
  currentCardBack: string = '';
  currentCardId: number = 0;
  nextCard: number = 0;
  buttonColor: string = "#1419a6";
  cardActions: string = 'SHOW ANSWER';
  voteDiv: boolean = false;

  constructor(public http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router, public services: ServicesService) {
    this.fetchedData = null;
    this.recommendedData = null;
  }

  ngOnInit() {
    let col_id: string | null = this.activatedRoute.snapshot.paramMap.get('id');

    let apiUrl: string = 'http://localhost:3000/api/collections';
    if (col_id) {
      this.showAll = false;
      this.link = "card";
    }
    else {
      col_id = "0";
    }
    const postData: object = {
      col_id: col_id,
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
          this.getRecommended();
          this.fetchedData = response;
          this.currentCard = response[0].front;
          this.currentCardBack = response[0].back;
          this.currentCardId = response[0].id;
          this.nextCard = 1;
          if (col_id != "0") {
            this.collectionTitle = `► ${response[0].collection_name}`;
          }
        },
        (error) => {
          console.error(error);
          this.router.navigate(['/account']);
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
