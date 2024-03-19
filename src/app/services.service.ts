import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interfaceAnalyticsSidebar } from './interfaces'

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  constructor(public http: HttpClient) { }

  // LOGGED IN & GENERAL STATE

  isLogged: boolean = false;
  isSignup: boolean = false;
  public loggedIn() {
    if (localStorage.getItem('token') && localStorage.getItem('token') != null) {
      this.isLogged = true;
    }
    else {
      this.isLogged = false;
    }
    return this.isLogged;
  }

  // SHARE
  shareButton: string = 'SHARE';

  public share(arg: string) {
    navigator.clipboard.writeText(`http://localhost:4200/${arg}`);
    this.shareButton = 'COPIED';
    setTimeout(() => {
      this.shareButton = 'SHARE';
    }, 800);
  }

  // ERROR MODAL

  msgToModal: string = '';
  modalPositive: string = 'red';
  modalActive: boolean = false;

  public msgModal(arg: string, arg2: boolean) {
    if (arg2) {
      this.modalPositive = 'green';
    }
    else {
      this.modalPositive = 'red';
    }

    this.msgToModal = arg;
    this.modalActive = true;
    setTimeout(() => {
      this.modalActive = false;
    }, 3000);

  }
  // CARD SELF - SHAPE SELECTOR

  public shapeSelect(arg: number) {
    let number = String(arg);
    if (number.length == 2) {
      number = number.substring(1, 2);
    }
    else {
      number = number;
    }
    if (number == "1") {
      return "shape1";
    }
    else if (number == "2") {
      return "shape2";
    }
    else if (number == "3") {
      return "shape3";
    }
    else if (number == "4") {
      return "shape4";
    }
    else if (number == "5") {
      return "shape5";
    }
    else {
      return "shape6";
    }
  }

  // CARD SELF - SHAPE COLOR SELECTOR

  public bgColor(arg: number) {
    let number = String(arg);
    if (number.length == 2) {
      number = number.substring(1, 2);
    }
    else {
      number = number;
    }

    if (number == "1") {
      return "#e86354";
    }
    else if (number == "2") {
      return "#FF304B";
    }
    else if (number == "3") {
      return "#017E72";
    }
    else if (number == "4") {
      return "#5455FE";
    }
    else if (number == "5") {
      return "#6186A5";
    }
    else if (number == "6") {
      return "##0C459F";
    }
    else if (number == "7") {
      return "##9F50FF";
    }
    else if (number == "8") {
      return "##954E64";
    }
    else if (number == "9") {
      return "##40B4E3";
    }
    else {
      return "#CE5A65";
    }
  }

  // VOTE
  voted: boolean = false;
  public vote(arg: string, arg2: number) {
    let token: string | null = localStorage.getItem('token');

    const postData: object = {
      vote: arg,
      card_id: arg2
    };

    const apiUrl: string = 'http://localhost:3000/api/vote';

    this.http.post(apiUrl, postData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      }
    })
      .subscribe(
        (response: object) => {
          this.getAnalyticsSidebar();
        },
        (error) => {
          console.log(error.error);
        }
      );
    console.log(arg, arg2);
    this.voted = true;
  }

  // ANALYTICS SIDEBAR
  isAccount: boolean = false;
  analyticsTotal: number = 0;
  analyticsYes: number = 0;
  analyticsNo: number = 0;

  public getAnalyticsSidebar() {
    const apiUrl: string = 'http://localhost:3000/api/analytics';
    this.http.get<interfaceAnalyticsSidebar[]>(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`,
      }
    })
      .subscribe(
        (data) => {
          if (data.length == 0 || !data) {
            // No action needed.
          }
          else if (data.length == 1) {
            if (data[0].votes == "yes") {
              this.analyticsYes = data[0].count;
            }
            else {
              this.analyticsYes = data[1].count;
            }
          }
          else {
            if (data[0].votes == "yes") {
              this.analyticsYes = data[0].count;
              this.analyticsNo = data[1].count;
            }
            else {
              this.analyticsYes = data[1].count;
              this.analyticsNo = data[0].count;
            }
          }
          this.analyticsTotal = this.analyticsNo + this.analyticsYes;

        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }
}
