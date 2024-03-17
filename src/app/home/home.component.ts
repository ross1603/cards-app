import { Component, Input, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { interfaceHome, interfaceRecommended } from '../interfaces'
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
  constructor(public http: HttpClient, public services: ServicesService, private Router: Router) {
    this.fetchedData = null;
    this.recommendedData = null;
  }

  public onSubmit() {
    console.log(`${this.form_search!.value.search}`);
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
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }
  ngOnInit() {
    this.getHome();
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