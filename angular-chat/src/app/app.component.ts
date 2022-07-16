import { Component } from '@angular/core';
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

  constructor() {
    firebase.initializeApp(config);
  }
}
