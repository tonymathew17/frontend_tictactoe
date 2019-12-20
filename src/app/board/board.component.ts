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

  markCell(tile: number, symbol: string): void {
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

  refreshCells(): void {
    this.tile1 = "";
    this.tile2 = "";
    this.tile3 = "";
    this.tile4 = "";
    this.tile5 = "";
    this.tile6 = "";
    this.tile7 = "";
    this.tile8 = "";
    this.tile9 = "";
  }

  disableEnableCells(disableOrEnable: boolean): void {
    this.tile1Disabled = disableOrEnable;
    this.tile2Disabled = disableOrEnable;
    this.tile3Disabled = disableOrEnable;
    this.tile4Disabled = disableOrEnable;
    this.tile5Disabled = disableOrEnable;
    this.tile6Disabled = disableOrEnable;
    this.tile7Disabled = disableOrEnable;
    this.tile8Disabled = disableOrEnable;
    this.tile9Disabled = disableOrEnable;
  }

  onCellClicked(tile): void {
    this.markCell(tile, "X");
    this.subscription = this.webSocketService.recieveMessage(tile).subscribe((computerMove: number) => {
      if (!(typeof computerMove === 'number')) {
        console.log("Not a number!");
      }
      this.markCell(computerMove, "O");
      this.subscription.unsubscribe();
    });
  }

  refreshBoard(): void {
    this.webSocketService.refreshBoard().subscribe(result => {
      if (result === 'Memory cleared!') {
        this.refreshCells();
        this.disableEnableCells(false);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
