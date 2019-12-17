import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subscriber, observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private url = 'http://localhost:3333/';
  private socket: any;
  tempReply: number;

  constructor() {
    this.socket = io.connect(this.url);
  }

  // sendMessage(msg: string) {
  //   this.socket.emit('tileClicked', msg);
  //   this.socket.on('tempReply', (data) => {
  //     this.tempReply = data;
  //   })
  // }
  recieveMessage(tile: number) {
    this.socket.emit('tileClicked', tile);

    return new Observable((observable) => {
      this.socket.on('messageFromServer', (computerMove: number) => {
        observable.next(computerMove);
      })
    });
  }

}
