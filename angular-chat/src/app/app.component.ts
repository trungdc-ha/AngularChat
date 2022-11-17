import {Component} from '@angular/core';
import * as firebase from 'firebase';
import {environment} from '../environments/environment';

const config = environment.config;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-chat';
  myArr: Array<number> = [1, 2, 3, 4, 5];

  constructor() {
    firebase.initializeApp(config);
  }

  test() {
    const myArr2: Array<number> = this.myArr.filter(value => value >= 3);
    console.log(myArr2);
  }
}
