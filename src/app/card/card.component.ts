import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { interfaceCard, interfaceRecommended } from '../interfaces';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  constructor(public http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router, public services: ServicesService) {
    this.fetchedData = null;
    this.recommendedData = null;
  }

  isTrue: boolean = false;
  buttonColor: string = "#1419a6";
  cardActions: string = 'SHOW ANSWER';
  buttonClicks: number = 0;
  public showBack(arg: number) {
    this.buttonClicks += 1;

    if (this.buttonClicks > 1) {
      this.router.navigate(['/collections/' + arg]);
    }
    this.isTrue = true;
    this.buttonColor = "#5b5b5b";
    this.cardActions = "OPEN CONTAINING COLLECTION";
  }

  fetchedData: interfaceCard[] | null;
  recommendedData: interfaceRecommended[] | null;

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

  ngOnInit() {
    const token: string | null = localStorage.getItem('token');
    let card_id: string | null = this.activatedRoute.snapshot.paramMap.get('id');

    if (!card_id) {
      this.router.navigate(['/']);
    }
    const apiUrl: string = 'http://localhost:3000/api/card';
    const postData: object = {
      card_id: card_id,
    };
    let headers: object;
    if (!token) {
      headers = {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    }
    else {
      headers = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        }
      }
    }
    this.http.post<interfaceCard[]>(apiUrl, postData, headers)
      .subscribe(
        (response) => {
          this.fetchedData = response;
          this.getRecommended();
        },
        (error) => {
          if (error) {
            console.error(error);
            this.router.navigate(['./']);
          }
        }
      );
  }
}
