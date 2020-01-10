import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import { Subscription } from 'rxjs';
import { fadeInContent } from '@angular/material';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  /*   private tile1Disabled: boolean = false;
    private tile2Disabled: boolean = false;
    private tile3Disabled: boolean = false;
    private tile4Disabled: boolean = false;
    private tile5Disabled: boolean = false;
    private tile6Disabled: boolean = false;
    private tile7Disabled: boolean = false;
    private tile8Disabled: boolean = false;
    private tile9Disabled: boolean = false; */
  readonly human: string = 'human';
  readonly computer: string = 'computer';

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
  cells: NodeList;
  boardsize: number = 3;
  cellList: Array<number>;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit() {
    (<HTMLElement>document.querySelector(".endgame")).style.display = "none";
    // Setting up game

    this.subscription = this.webSocketService.setupGame(this.boardsize).subscribe((response: any) => {
      console.log('setupGame response: ', response);
      // Generating possible cells
      this.cellList = response;

      this.subscription.unsubscribe();
    });

    this.cells = document.querySelectorAll('.cell');
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].addEventListener('click', this.cellClicked.bind(this), false);
    }
  }

  cellClicked(clickedCellEvent) {
    let clickedCell = clickedCellEvent.target.id;
    // disabling clicked cell
    document.getElementById(clickedCell).removeEventListener('click', this.cellClicked, false);
    // Marking player move in the board
    this.markCell(this.human, clickedCell);
    // Connecting with backend server to get computerMove/Result
    this.subscription = this.webSocketService.getComputerMove(+clickedCell).subscribe((response: any) => {
      console.log('response: ', response);
      if (response.computerMove) this.markCell(this.computer, response.computerMove);
      if (response.winner && response.winningCombination) {
        this.disableEnableCells(true);
        this.highlightCells(response.winner, response.winningCombination);
        this.showResult(response.winner);
      }
      this.subscription.unsubscribe();
    });
  }

  showResult(winner) {
    let text = ""
    if (winner === 'tie') {
      text = 'Tied!'
    }
    else {
      text = winner === this.human ? "You Won!" : "You Lose!";
    }
    (<HTMLElement>document.querySelector(".endgame")).style.display = "block";
    (<HTMLElement>document.querySelector(".endgame .text")).innerText = text;
  }

  highlightCells(winner, cellsNeedingHiglight) {
    let className = 'winner';
    if (winner === 'tie') {
      className = 'tie';
      cellsNeedingHiglight = this.cellList;
    }
    let cells = document.querySelectorAll(".cell");
    for (let i = 0; i < cellsNeedingHiglight.length; i++) {
      let cell = cellsNeedingHiglight[i];
      cells[cell].className = className;
    }
  }

  markCell(player, cell) {
    if (player === this.computer) {
      document.getElementById(cell).innerHTML = 'O';
    } else if (player === this.human) {
      document.getElementById(cell).innerHTML = 'X';
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
    console.log('Result obtained, disabling cells');
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].removeEventListener('click', this.cellClicked, false);
    }
  }

  /*     onCellClicked(tile): void {
        console.log('tile>>>>>>>>>>', tile);
        this.markCell(tile, "X");
        this.subscription = this.webSocketService.recieveMessage(tile).subscribe((computerMove: number) => {
          if (!(typeof computerMove === 'number')) {
            console.log("Not a number!");
          }
          console.log('computerMove>>>>>>>>>>', computerMove);
          this.markCell(computerMove, "O");
          this.subscription.unsubscribe();
        });
      } */

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
