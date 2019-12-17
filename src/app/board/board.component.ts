import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private tile1Disabled: boolean = false;
  private tile2Disabled: boolean = false;
  private tile3Disabled: boolean = false;
  private tile4Disabled: boolean = false;
  private tile5Disabled: boolean = false;
  private tile6Disabled: boolean = false;
  private tile7Disabled: boolean = false;
  private tile8Disabled: boolean = false;
  private tile9Disabled: boolean = false;

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

  resetCells(tile: number, symbol: string): void {
    if (tile == 1) {
      this.tile1Disabled = true;
      this.tile1 = symbol;
    }
    if (tile == 2) {
      this.tile2Disabled = true;
      this.tile2 = symbol;
    }
    if (tile == 3) {
      this.tile3Disabled = true;
      this.tile3 = symbol;
    }
    if (tile == 4) {
      this.tile4Disabled = true;
      this.tile4 = symbol;
    }
    if (tile == 5) {
      this.tile5Disabled = true;
      this.tile5 = symbol;
    }
    if (tile == 6) {
      this.tile6Disabled = true;
      this.tile6 = symbol;
    }
    if (tile == 7) {
      this.tile7Disabled = true;
      this.tile7 = symbol;
    }
    if (tile == 8) {
      this.tile8Disabled = true;
      this.tile8 = symbol;
    }
    if (tile == 9) {
      this.tile9Disabled = true;
      this.tile9 = symbol;
    }
  }

  onCellClicked(tile): void {
    this.resetCells(tile, "X");
    this.subscription = this.webSocketService.recieveMessage(tile).subscribe((computerMove: number) => {
      this.resetCells(computerMove, "O");
      this.subscription.unsubscribe();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
