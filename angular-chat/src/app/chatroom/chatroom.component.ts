import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export const snapshotToArray = (snapshot: any) => {
  const returnArr = [];

  snapshot.forEach((childSnapshot: any) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {

  @ViewChild('chatcontent') chatcontent: ElementRef;
  scrolltop: number = null;

  chatForm: FormGroup;
  nickname = '';
  message = '';
  users = [];
  chats = [];
  matcher = new MyErrorStateMatcher();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              public datepipe: DatePipe) {
                this.nickname = localStorage.getItem('nickname');
                firebase.database().ref('chats/Unihack_2022').on('value', resp => {
                  this.chats = [];
                  this.chats = snapshotToArray(resp);
                  setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500);
                });
              }

  ngOnInit(): void {
    this.chatForm = this.formBuilder.group({
      'message' : [null, Validators.required]
    });
  }

  onFormSubmit(form: any) {
    const chat = form;
    // chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'message';
    const newMessage = firebase.database().ref('chats/Unihack_2022').push();
    newMessage.set(chat);
    this.chatForm = this.formBuilder.group({
      'message' : [null, Validators.required]
    });
  }

  exitChat() {
    const chat = { nickname: '', message: '', date: '', type: '' };
    // chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.message = ` ${this.nickname} leave the room`;
    chat.type = 'exit';
    const newMessage = firebase.database().ref('chats/Unihack_2022').push();
    newMessage.set(chat);
    localStorage.removeItem('nickname');
    this.router.navigate(['/login']);
  }

}
