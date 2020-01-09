import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private url = 'http://localhost:3333/';
  private socket: any;
  tempReply: number;

  constructor(private http: HttpClient) {
    this.socket = io.connect(this.url);
  }

  recieveMessage(tile: number) {
    this.socket.emit('tileClicked', tile);

    return new Observable((observable) => {
      this.socket.on('messageFromServer', (computerMove: number) => {
        observable.next(computerMove);
      })
    });
  }

  refreshBoard() {
    return this.http.post('http://localhost:3333/refreshBoard', { responseType: 'text' })
      .pipe(map((result: any) => result));
  }

  setupGame(boardSize: number) {
    return this.http.post('http://localhost:3333/setupGame/' + boardSize, { responseType: 'json' })
      .pipe(map((result: JSON) => result));
  }

}
