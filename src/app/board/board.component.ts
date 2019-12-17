import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  tile: number;
  tile1: any;
  tile2: any;
  tile3: any;
  tile4: any;
  tile5: any;
  tile6: any;
  tile7: any;
  tile8: any;
  tile9: any;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit() {
  }

  resetCells(tileClicked: number, computerMove: number) {
    if (tileClicked == 1) {
      this.tile1 = computerMove;
      this.tile2 = "";
      this.tile3 = "";
      this.tile4 = "";
      this.tile5 = "";
      this.tile6 = "";
      this.tile7 = "";
      this.tile8 = "";
      this.tile9 = "";
    }
    else if (tileClicked == 2) {
      this.tile2 = computerMove;
      this.tile1 = "";
      this.tile3 = "";
      this.tile4 = "";
      this.tile5 = "";
      this.tile6 = "";
      this.tile7 = "";
      this.tile8 = "";
      this.tile9 = "";
    }
    else if (tileClicked == 3) {
      this.tile3 = computerMove;
      this.tile2 = "";
      this.tile1 = "";
      this.tile4 = "";
      this.tile5 = "";
      this.tile6 = "";
      this.tile7 = "";
      this.tile8 = "";
      this.tile9 = "";
    }
    else if (tileClicked == 4) {
      this.tile4 = computerMove;
      this.tile2 = "";
      this.tile3 = "";
      this.tile1 = "";
      this.tile5 = "";
      this.tile6 = "";
      this.tile7 = "";
      this.tile8 = "";
      this.tile9 = "";
    }
    else if (tileClicked == 5) {
      this.tile5 = computerMove;
      this.tile2 = "";
      this.tile3 = "";
      this.tile4 = "";
      this.tile1 = "";
      this.tile6 = "";
      this.tile7 = "";
      this.tile8 = "";
      this.tile9 = "";
    }
    else if (tileClicked == 6) {
      this.tile6 = computerMove;
      this.tile2 = "";
      this.tile3 = "";
      this.tile4 = "";
      this.tile5 = "";
      this.tile1 = "";
      this.tile7 = "";
      this.tile8 = "";
      this.tile9 = "";
    }
    else if (tileClicked == 7) {
      this.tile7 = computerMove;
      this.tile2 = "";
      this.tile3 = "";
      this.tile4 = "";
      this.tile5 = "";
      this.tile6 = "";
      this.tile1 = "";
      this.tile8 = "";
      this.tile9 = "";
    }
    else if (tileClicked == 8) {
      this.tile8 = computerMove;
      this.tile2 = "";
      this.tile3 = "";
      this.tile4 = "";
      this.tile5 = "";
      this.tile6 = "";
      this.tile7 = "";
      this.tile1 = "";
      this.tile9 = "";
    }
    else if (tileClicked == 9) {
      this.tile9 = computerMove;
      this.tile2 = "";
      this.tile3 = "";
      this.tile4 = "";
      this.tile5 = "";
      this.tile6 = "";
      this.tile7 = "";
      this.tile8 = "";
      this.tile1 = "";
    }
  }

  onCellClicked(tile) {
    this.webSocketService.recieveMessage(tile).subscribe((computerMove: number) => {
      console.log('tile>>>>>>>>>>>>>>>>>>>>.', tile);
      console.log('computerMove>>>>>>>>>>>>>>>>>>>>.', computerMove);
      this.resetCells(tile, computerMove);
    });
  }

}
