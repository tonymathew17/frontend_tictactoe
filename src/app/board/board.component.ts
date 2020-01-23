import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy, AfterViewInit {
  private subscription: Subscription;
  readonly human: string = 'human';
  readonly computer: string = 'computer';

  boardConfig: Array<Array<number>>;
  cells: NodeList;
  cellList: Array<number>;
  cellClickedReference: any;
  selectedBoardSize: number;

  constructor(private webSocketService: WebSocketService) { }

  boardSizeList: Array<number> = [3, 4, 5, 6, 7, 8, 9, 10];

  ngOnInit() {
    this.cellClickedReference = this.cellClicked.bind(this);
    this.setupGame(3);
  }

  setupGame(boardsize) {
    this.generateBoardConfig(boardsize);
    (<HTMLElement>document.querySelector(".endgame")).style.display = "none";

    // Setting up game
    this.subscription = this.webSocketService.setupGame(boardsize).subscribe((response: any) => {
      this.makeCellsClickable();
      console.log('setupGame response: ', response);
      // Generating possible cells
      this.cellList = response;
      this.subscription.unsubscribe();
    });
  }

  newBoardSizeSelected() {
    if (this.boardSizeList.includes(this.selectedBoardSize)) {
      this.setupGame(this.selectedBoardSize);
    }
  }

  makeCellsClickable() {
    // making cells clickable
    this.cells = document.querySelectorAll('.cell');
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].addEventListener('click', this.cellClickedReference, false);
    }
  }

  // This function is called when the document is ready
  ngAfterViewInit() {
    this.makeCellsClickable();
  }

  generateBoardConfig(boardsize: number) {
    this.boardConfig = [];
    let arr = [];
    for (let i = 0; i < (boardsize * boardsize); i++) {
      arr.push(i)
      if (arr.length === boardsize) {
        this.boardConfig.push(arr);
        arr = [];
      }
    }
  }

  cellClicked(clickedCellEvent) {
    let clickedCell = clickedCellEvent.target.id;
    // disabling clicked cell
    this.disableCells([+clickedCell]);
    // Marking player move in the board
    this.markCell(this.human, clickedCell);
    // Connecting with backend server to get computerMove/Result
    this.subscription = this.webSocketService.getComputerMove(+clickedCell).subscribe((response: any) => {
      console.log('response: ', response);
      if (Object.keys(response).includes("computerMove")) {
        this.disableCells([response.computerMove]);
        this.markCell(this.computer, response.computerMove);
      }
      if (response.winner && response.winningCombination) {
        this.disableCells(this.cellList);
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

  highlightCells(winner, cellsNeedingHighlight) {
    if (winner === 'tie') {
      cellsNeedingHighlight = this.cellList;
    }
    for (let i = 0; i < cellsNeedingHighlight.length; i++) {
      this.markCell(winner, cellsNeedingHighlight[i], true);
    }
  }

  markCell(player, cell, winner = null) {
    if (player === this.computer) {
      if (winner) {
        document.getElementById(cell).style.backgroundImage = 'url(assets/img/O_Won.svg)';
      } else {
        document.getElementById(cell).style.backgroundImage = 'url(assets/img/O.svg)';
      }
    } else if (player === this.human) {
      if (winner) {
        document.getElementById(cell).style.backgroundImage = 'url(assets/img/X_Won.svg)';
      } else {
        document.getElementById(cell).style.backgroundImage = 'url(assets/img/X.svg)';
      }
    }
  }

  disableCells(cellList: Array<number>): void {
    for (let i = 0; i < cellList.length; i++) {
      let cell = this.cells[cellList[i]];
      cell.removeEventListener('click', this.cellClickedReference, false);
      document.getElementById('' + cellList[i]).style.cursor = 'not-allowed';
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
